import { Controller, Post, Body, UsePipes, Get, UseGuards, Put } from "@nestjs/common/decorators"
import { UserService } from "./user.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UserEntity } from "./user.entity"
import { IUserResponse } from "./types/userResponse.interface"
import { ValidationPipe } from "@nestjs/common"
import { LoginUserDto } from "./dto/login-user.dto"
import { User } from "@app/user/decorators/user.decorator"
import { AuthGuard } from "./guards/auth.guard"

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
  @UsePipes(new ValidationPipe()) // validation data require
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<IUserResponse> {
    return this.userService.login(loginUserDto)
  }
  @Get('user')
  @UseGuards(AuthGuard) // auth require
  async getCurrentUser(@User() user: UserEntity): Promise<IUserResponse> {
    return this.userService.buildUserResponse(user)
  }
  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(@User() currentUser: UserEntity, @Body('user') newUser: UserEntity): Promise<IUserResponse> {
    const updatedUser: UserEntity = await this.userService.update(currentUser, newUser)
    const response: IUserResponse = this.userService.buildUserResponse(updatedUser)
    delete response.user.password
    return response
  }
}
