import {Controller, Post} from "@nestjs/common/decorators";
import { UserService } from "./user.service"

@Controller('users')
export class UserController{
  constructor(private readonly userService: UserService){}
  @Post()
  async registration(){
    return await this.userService.registration()
  }
}
