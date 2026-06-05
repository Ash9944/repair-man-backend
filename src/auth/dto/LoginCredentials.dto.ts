import { IsString } from "class-validator";

export class LoginCredentialsDto {
    @IsString()
    phoneNumber: string;

    @IsString()
    countryCode: string;
}

export class OtpVerificationDto {
    @IsString()
    phoneNumber: string;

    @IsString()
    code: string
}

export class AdminLoginResponseDto {
    @IsString()
    userName: string;

    @IsString()
    password: string;
}