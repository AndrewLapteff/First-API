import { User } from "@app/user/decorators/user.decorator"
import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common"
import { ProfileService } from "./profile.service"
import { AuthGuard } from "@app/user/guards/auth.guard"
import { ProfileType } from "./types/ProfileType"

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }
  @Get(':username')
  async getProfile(@Param('username') username: string, @User('id') currentUserId: number): Promise<{ profile: ProfileType }> {
    const profile: ProfileType = await this.profileService.getProfile(username, currentUserId)
    return this.profileService.buildProfileResponse(profile)
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async follow(@Param('username') username: string, @User('id') currentUserId: number): Promise<{ profile: ProfileType }> {
    const profile: ProfileType = await this.profileService.follow(username, currentUserId)
    return this.profileService.buildProfileResponse(profile)
  }

  @Delete(':username/unfollow')
  @UseGuards(AuthGuard)
  async unfollow(@Param('username') username: string, @User('id') currentUserId: number): Promise<{ profile: ProfileType }> {
    const profile: ProfileType = await this.profileService.unfollow(username, currentUserId)
    return this.profileService.buildProfileResponse(profile)
  }
}