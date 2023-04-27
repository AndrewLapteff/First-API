import { Injectable } from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto"
import { UserEntity } from "./user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { sign } from "jsonwebtoken"
import { UserType } from "./types/user.type"
import { IUserResponse } from "./types/userResponse.interface"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>) { }

  // Send data to DB
  async registration(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity()
    Object.assign(newUser, createUserDto)
    let createdUser = await this.userRepository.save(newUser)
    return createdUser
  }

  buildUserResponse(user: UserType): IUserResponse {
    const userInfo = { user: { ...user, token: this.createJWTToken(user) } }
    return userInfo
  }

  createJWTToken(user: UserType) {
    return sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET)
  }
}