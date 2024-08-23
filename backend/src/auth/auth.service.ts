import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from './interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { RegisterUserDto, LoginResponseDto, User as UserResponse } from './dto';
import { Result } from 'src/common/result';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/entries/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async getJwtToken(payload: JwtPayload): Promise<string> {
    const token = this.jwtService.signAsync(payload);
    return token;
  }

  async registerUser(
    registerUserDto: RegisterUserDto,
  ): Promise<Result<LoginResponseDto>> {
    try {
      const { password, ...userData } = registerUserDto;

      const newUser = new this.userModel({
        password: bcrypt.hashSync(password, 10),
        ...userData,
      });

      await newUser.save();

      const token = await this.getJwtToken({ id: newUser.id });
      const response: LoginResponseDto = {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          roles: newUser.roles,
        },
        token,
      };

      return Result.success(response, 201);
    } catch (error) {
      if (error.code && error.code === 11000) {
        return Result.fail(null, 400, 'User already exists', error);
      }
      return Result.fail(
        null,
        error.statusCode ? error.statusCode : 500,
        error.msg ? error.msg : 'An error have ocurred',
        error,
      );
    }
  }

  async login(loginDto: LoginDto): Promise<Result<LoginResponseDto>> {
    try {
      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email });

      if (!user) {
        return Result.fail(
          null,
          404,
          'User not found',
          new Error('User not found'),
        );
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return Result.fail(
          null,
          403,
          'Invalid password',
          new Error('Invalid Password'),
        );
      }

      const token = await this.getJwtToken({ id: user.id });

      const response: LoginResponseDto = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        },
        token,
      };

      return Result.success(response, 200);
    } catch (error) {
      return Result.fail(
        null,
        error.statusCode ? error.statusCode : 500,
        error.msg ? error.msg : 'An error have ocurred',
        error,
      );
    }
  }

  async findAllUsers(): Promise<Result<UserResponse[]>> {
    try {
      const users = await this.userModel.find();

      const response: UserResponse[] = users.map((user) => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        };
      });

      return Result.success(response, 200);
    } catch (error) {
      return Result.fail(
        null,
        error.statusCode ? error.statusCode : 500,
        error.msg ? error.msg : 'An error have ocurred',
        error,
      );
    }
  }

  async findUserById(id: string): Promise<Result<UserResponse>> {
    try {
      const user = await this.userModel.findOne({ _id: id, isActive: true });

      if (!user) {
        return Result.fail(
          null,
          404,
          'User not found',
          new Error('User not found'),
        );
      }

      const response: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      };

      return Result.success(response, 200);
    } catch (error) {
      return Result.fail(
        null,
        error.statusCode ? error.statusCode : 500,
        error.msg ? error.msg : 'An error have ocurred',
        error,
      );
    }
  }

}
