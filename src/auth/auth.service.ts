import { HttpStatus, Inject, Injectable, InternalServerErrorException, Scope } from '@nestjs/common';
import { AdminLoginCredentialsDto, LoginCredentialsDto, OtpVerificationDto } from './dto/LoginCredentials.dto';
import * as bcrypt from 'bcrypt';
import { BaseRepository } from 'src/common/base-repository';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CommonServices } from 'src/common/commonServices';
import Exception from 'src/common/exceptionHandling';
import { Otp } from 'src/entities/otp.entity';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/entities/token.entity';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.REQUEST })
export class AuthService extends BaseRepository {
    constructor(
        datasource: DataSource,
        private commonServices: CommonServices,
        @Inject(REQUEST) req: Request,
        private readonly jwtService: JwtService,
        private configService: ConfigService
    ) {
        super(datasource, req);
    }

    async generateOtp(body: LoginCredentialsDto): Promise<Boolean> {
        try {
            const userRepo = this.getRepository(User);
            var user = await userRepo.findOne({ where: { mobile: body.phoneNumber } });
            if (!user) {
                const userEntry = userRepo.create({
                    mobile: body.phoneNumber,
                    country_code: body.countryCode
                })

                user = await userRepo.save(userEntry);
            }

            const otpRepo = this.getRepository(Otp);
            const isExistingOtpRecord = await otpRepo.findOne({ where: { user_id: user.id } });
            if (isExistingOtpRecord) {
                const expiryTime = new Date(isExistingOtpRecord.created_at);
                expiryTime.setMinutes(expiryTime.getMinutes() + 5); // OTP valid for 5 minutes
                if (new Date() < expiryTime) {
                    return true;
                }

                await otpRepo.remove(isExistingOtpRecord);
            }

           
            const IS_DEFAULT_OTP_ENABLED = this.configService.get<string>('IS_OTP_ENABLED') == 'true' ? true : false;
             const OTP_LENGTH = this.configService.get<number>('OTP_LENGTH') || 6;

            const otp = !IS_DEFAULT_OTP_ENABLED ? this.configService.get<string>('OTP_DEFAULT') || '111111' : this.commonServices.generateRandomCode(OTP_LENGTH);
            const hashedOtp = await this.commonServices.hashToken(otp);

            // Here, you would typically save the OTP to the database or send it via email/SMS
            //need to integrate Sms/Email


            const otpEntry = otpRepo.create({
                user_id: user.id,
                code: hashedOtp,
            });

            await otpRepo.save(otpEntry);
            return true;
        } catch (error) {
            throw Exception(error?.cause || HttpStatus.INTERNAL_SERVER_ERROR, error?.message || "Failed to generate OTP");
        }
    }

    async verifyOtp(body: OtpVerificationDto): Promise<{ token: string, success: Boolean, user: any }> {
        try {
            const userRepo = this.getRepository(User);
            const user = await userRepo.findOne({ where: { mobile: body.phoneNumber } });
            if (!user) {
                throw new Error("User not found", { cause: HttpStatus.BAD_REQUEST });
            }

            const otpRepo = this.getRepository(Otp);
            const otpEntry = await otpRepo.findOne({ where: { user_id: user.id }, order: { created_at: 'DESC' } });
            if (!otpEntry) {
                throw new Error("OTP not found", { cause: HttpStatus.BAD_REQUEST });
            }

            const expiryTime = new Date(otpEntry.created_at);
            expiryTime.setMinutes(expiryTime.getMinutes() + 5); // OTP valid for 5 minutes
            if (new Date() > expiryTime) {
                await otpRepo.remove(otpEntry);
                throw new Error("OTP has expired", { cause: HttpStatus.BAD_REQUEST });
            }

            const isOtpValid = await this.commonServices.compareHashedTokens(otpEntry.code, body.code);
            if (!isOtpValid) {
                throw new Error("Invalid OTP", { cause: HttpStatus.BAD_REQUEST });
            }

            // Generate access token
            const payload = { userId: user.id, phoneNumber: user.mobile }
            const accessToken = this.jwtService.sign(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '7d',
            });

            const hashedAccessToken = await this.commonServices.hashToken(accessToken);
            const tokenRepo = this.getRepository(Token);
            const ip = this.commonServices.getIP(this.request);

            // Upsert: replace any existing token for this user+IP
            const existing = await tokenRepo.findOne({ where: { user_id: user.id, ip_address: ip } });
            if (existing) {
                await tokenRepo.update({ id: existing.id }, { access_token: hashedAccessToken });
            } else {
                const tokenEntry = tokenRepo.create({
                    user_id: user.id,
                    access_token: hashedAccessToken,
                    ip_address: ip,
                });
                await tokenRepo.save(tokenEntry);
            }

            await otpRepo.remove(otpEntry);
            return { token: accessToken, success: true, user: user };
        } catch (error) {
            throw Exception(error?.cause || HttpStatus.INTERNAL_SERVER_ERROR, error?.message || "Failed to verify OTP");
        }
    }

    async adminLogin(body: AdminLoginCredentialsDto): Promise<{ access_token: string; success: boolean }> {
        try {
            const userRepo = this.getRepository(User);
            const user = await userRepo.findOne({
                where: { email: body.email },
                relations: ['roles'],
            });

            if (!user) {
                throw new Error('Invalid credentials', { cause: HttpStatus.UNAUTHORIZED });
            }

            if (!user.password) {
                throw new Error('Invalid credentials', { cause: HttpStatus.UNAUTHORIZED });
            }

            const passwordValid = await bcrypt.compare(body.password, user.password);
            if (!passwordValid) {
                throw new Error('Invalid credentials', { cause: HttpStatus.UNAUTHORIZED });
            }

            if (user.roles?.key !== 'admin') {
                throw new Error('Access denied', { cause: HttpStatus.FORBIDDEN });
            }

            const payload = { userId: user.id, mobile: user.mobile, role: 'admin' };
            const access_token = this.jwtService.sign(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '1d',
            });

            return { access_token, success: true };
        } catch (error) {
            throw Exception(error?.cause || HttpStatus.INTERNAL_SERVER_ERROR, error?.message || 'Login failed');
        }
    }
}
