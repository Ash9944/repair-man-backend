import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { BaseRepository } from '../../common/base-repository';
import { CommonServices } from '../../common/commonServices';
import { DataSource } from 'typeorm';
import Exception from '../../common/exceptionHandling';
import { User } from '../../entities/user.entity';
import { UpdateUserDetails } from './dto/usersDto';

@Injectable()
export class UsersService extends BaseRepository {
  constructor(
    datasource: DataSource,
    private commonServices: CommonServices,
    @Inject(REQUEST) req: Request,
    private readonly jwtService: JwtService
  ) {
    super(datasource, req);
  }

  async updateUserDetails(body: UpdateUserDetails) {
    try {
      const userRepo = this.getRepository(User);
      const user = await userRepo.findOne({ where: { id: body.id } });
      if (!user) {
        throw new Error("Coudn't find the user to update", { cause: HttpStatus.BAD_REQUEST });
      }

      const userData = await userRepo.update({ id: body.id }, {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        dob: body.dob,
        gender: body.gender
      });

      const modifiedUser = await userRepo.findOne({ where: { id: body.id } });
      return { success: true, user: modifiedUser };
    } catch (error) {
      throw Exception(error?.cause || HttpStatus.INTERNAL_SERVER_ERROR, error?.message || "Failed to update user details");
    }
  }
}
