import { UserEntity } from "@app/user/user.entity"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FollowEntity } from "./follow.entity"
import { ProfileType } from "./types/ProfileType"

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>
  ) { }
  async getProfile(username: string, currentUserId: number): Promise<ProfileType> {
    const user: UserEntity = await this.userRepository.findOne({ where: { username } })
    if (!user)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    const following: FollowEntity = await this.followRepository.findOne({ where: { followerId: currentUserId, followingId: user.id } })
    if (following) {
      return { ...user, following: true }
    } else {
      return { ...user, following: false }
    }
  }

  async follow(username: string, currentUserId: number): Promise<ProfileType> {
    const user: UserEntity = await this.userRepository.findOne({ where: { username } })
    if (!user)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    if (user.id === currentUserId)
      throw new HttpException(`You can't follow yourself`, HttpStatus.BAD_REQUEST)
    const following: FollowEntity = await this.followRepository.findOne({
      where: {
        followerId: currentUserId, followingId: user.id
      }
    })
    if (!following) {
      const newFollowing = new FollowEntity()
      newFollowing.followerId = currentUserId
      newFollowing.followingId = user.id
      await this.followRepository.save(newFollowing)
      return { ...user, following: true }
    }
    return { ...user, following: true }
  }

  async unfollow(username: string, currentUserId: number): Promise<ProfileType> {
    const user: UserEntity = await this.userRepository.findOne({ where: { username } })
    if (!user)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    if (user.id === currentUserId)
      throw new HttpException(`You can't follow yourself`, HttpStatus.BAD_REQUEST)
    const following: FollowEntity = await this.followRepository.findOne({
      where: {
        followerId: currentUserId, followingId: user.id
      }
    })
    if (following) {
      await this.followRepository.delete(following)
      return { ...user, following: false }
    }
    return { ...user, following: false }
  }

  buildProfileResponse(profile: ProfileType): { profile: ProfileType } {
    return { profile }
  }
}
