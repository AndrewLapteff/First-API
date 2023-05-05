import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto"
import { UserEntity } from "./user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, UpdateResult } from "typeorm"
import { sign } from "jsonwebtoken"
import { UserType } from "./types/user.type"
import { IUserResponse } from "./types/userResponse.interface"
import { LoginUserDto } from "./dto/login-user.dto"
import { compare, hash } from "bcrypt"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>) { }

  // Send data to DB
  async registration(createUserDto: CreateUserDto): Promise<UserEntity> {
    const IsEmailAlreadyExist = await this.userRepository.findOneBy({ email: createUserDto.email })
    const IsUsernameAlreadyExist = await this.userRepository.findOneBy({ username: createUserDto.username })
    if (IsEmailAlreadyExist)
      throw new HttpException('Email is already in use', HttpStatus.UNPROCESSABLE_ENTITY) // 422
    if (IsUsernameAlreadyExist)
      throw new HttpException('Username is already in use', HttpStatus.UNPROCESSABLE_ENTITY) // 422

    const newUser = new UserEntity()
    Object.assign(newUser, createUserDto)
    let createdUser = await this.userRepository.save(newUser)
    delete createdUser.password
    return createdUser
  }

  async login(loginUserDto: LoginUserDto): Promise<IUserResponse> {
    const user = await this.userRepository.findOne({ where: { email: loginUserDto.email }, select: [ 'id', 'username', 'email', 'image', 'bio', 'password' ] })
    if (!user)
      throw new HttpException('User not found', HttpStatus.UNPROCESSABLE_ENTITY)

    const IsCorrectPassword = await compare(loginUserDto.password, user.password)
    if (IsCorrectPassword) {
      delete user.password
      return this.buildUserResponse(user)
    } else {
      throw new HttpException('Wrong password', HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  async update(currentUser: UserEntity, newUser: UserEntity) {
    const oldUser = await this.getUserById(currentUser.id)
    const updUser = Object.assign(oldUser, newUser)
    if (currentUser.password != newUser.password && newUser.password != null) {
      updUser.password = await this.createHashPassword(newUser.password)
    }
    return await this.userRepository.save(updUser)
  }

  getUserById(uid: number) {
    return this.userRepository.findOne({ where: { id: uid }, select: [ 'id', 'username', 'email', 'image', 'bio', 'password' ] })
  }

  buildUserResponse(user: UserType): IUserResponse {
    const userResponse = { user: { ...user, token: this.createJWTToken(user) } }
    delete userResponse.user.password
    return userResponse
  }

  createJWTToken(user: UserType): string {
    return sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET)
  }

  async createHashPassword(password: string) {
    return await hash(password, 10)
  }
}