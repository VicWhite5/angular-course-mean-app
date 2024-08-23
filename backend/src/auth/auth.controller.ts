import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Result } from 'src/common/result';
import { HttpResponseHandler } from 'src/common/http-response.handler';

import { LoginDto, RegisterUserDto, LoginResponseDto } from './dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const serviceResult: Result<LoginResponseDto> =
      await this.authService.registerUser(registerUserDto);

    if (!serviceResult.IsSuccess) {
      HttpResponseHandler.HandleException(
        serviceResult.StatusCode,
        serviceResult.message,
        serviceResult.Error,
      );
    }

    return HttpResponseHandler.Success(
      serviceResult.StatusCode,
      serviceResult.Data,
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const serviceResult: Result<LoginResponseDto> =
      await this.authService.login(loginDto);
    if (!serviceResult.IsSuccess) {
      HttpResponseHandler.HandleException(
        serviceResult.StatusCode,
        serviceResult.message,
        serviceResult.Error,
      );
    }

    return HttpResponseHandler.Success(
      serviceResult.StatusCode,
      serviceResult.Data,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAllUsers(@Request() req: Request) {
    const user = req['user'];
    console.log(user);

    const serviceResult = await this.authService.findAllUsers();

    if (!serviceResult.IsSuccess) {
      HttpResponseHandler.HandleException(
        serviceResult.StatusCode,
        serviceResult.message,
        serviceResult.Error,
      );
    }

    return HttpResponseHandler.Success(
      serviceResult.StatusCode,
      serviceResult.Data,
    );
  }

  @UseGuards(AuthGuard)
  @Get('check-token')
  async checkToken(@Request() req: Request) {
    const user = req['user'];
    const token: string = await this.authService.getJwtToken({ id: user.id });

    const response = {
      user: user,
      token,
    };

    return HttpResponseHandler.Success(200, response);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
