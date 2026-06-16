import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginCredentialsDto, LoginCredentialsDto, OtpVerificationDto } from './dto/LoginCredentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('generate/otp')
  generateOtp(@Body() body: LoginCredentialsDto) {
    return this.authService.generateOtp(body);
  }

  @Post('verify/otp')
  verifyOtp(@Body() body: OtpVerificationDto) {
    return this.authService.verifyOtp(body);
  }

  @Post('login')
  adminLogin(@Body() body: AdminLoginCredentialsDto) {
    return this.authService.adminLogin(body);
  }
}
