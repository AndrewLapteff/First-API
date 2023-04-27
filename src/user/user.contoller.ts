import {Controller, Post, Body} from "@nestjs/common/decorators";
import { UserService } from "./user.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UserEntity } from "./user.entity"
import { IUserResponse } from "./types/userResponse.interface"

@Controller('users')
export class UserController{
  constructor(private readonly userService: UserService){}
  @Post()
  async registration(@Body('user') createUserDto: CreateUserDto): Promise<IUserResponse> {
    const user: UserEntity = await this.userService.registration(createUserDto)
    return this.userService.buildUserResponse(user)
  }
}
