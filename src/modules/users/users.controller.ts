import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDetails } from './dto/usersDto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { TransactionInterceptor } from 'src/interceptors/transaction.inteceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post('update/details')
  updateUserDetails(@Body() body: UpdateUserDetails) {
    return this.usersService.updateUserDetails(body);
  }
}
