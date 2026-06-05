import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginResponseDto, LoginCredentialsDto, OtpVerificationDto } from './dto/LoginCredentials.dto';
import { TransactionInterceptor } from 'src/interceptors/transaction.inteceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  @Post('generate/otp')
  generateOtp(@Body() body: LoginCredentialsDto) {
    return this.authService.generateOtp(body);
  }

  @Post('verify/otp')
  verifyOtp(@Body() body: OtpVerificationDto) {
    return this.authService.verifyOtp(body)
  }

  // @Post('login')
  // login(@Body() body: AdminLoginResponseDto) {
  //   return this.authService.login(body);
  // }
}
