import { Controller, Post, Body, UsePipes, Get, Req } from "@nestjs/common/decorators"
import { UserService } from "./user.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UserEntity } from "./user.entity"
import { IUserResponse } from "./types/userResponse.interface"
import { ValidationPipe } from "@nestjs/common"
import { LoginUserDto } from "./dto/login-user.dto"
import { RequestExtended } from "@app/types/requestExtended.interface"

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Post('users')
  @UsePipes(new ValidationPipe())
  async registration(@Body('user') createUserDto: CreateUserDto): Promise<IUserResponse> {
    const user: UserEntity = await this.userService.registration(createUserDto)
    return this.userService.buildUserResponse(user)
  }
  @Post('users/login')
  @UsePipes(new ValidationPipe()) // validation require
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<IUserResponse> {
    return this.userService.login(loginUserDto)
  }
  @Get('user')
  async currentUser(@Req() request: RequestExtended): Promise<IUserResponse> {
    return this.userService.buildUserResponse(request.user)
  }
}
