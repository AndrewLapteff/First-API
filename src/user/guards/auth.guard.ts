import { CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common"
import { IUserResponse } from "../types/userResponse.interface"

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IUserResponse>()
    if (request.user) {
      return true
    }
    throw new HttpException("User don't authorized", HttpStatus.UNAUTHORIZED)
  }
}