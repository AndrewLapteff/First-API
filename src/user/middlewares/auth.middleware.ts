import { RequestExtended } from "@app/types/requestExtended.interface"
import { Injectable, NestMiddleware } from "@nestjs/common"
import { NextFunction, Response } from "express"
import { verify } from 'jsonwebtoken'
import { UserService } from "../user.service"

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) { }
  async use(req: RequestExtended, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null
      next()
      return
    }
    const token = req.headers.authorization.split(' ')[ 1 ] // 'Token qhkesljkvdllsdj.haajsdlj...'
    try {
      const user = verify(token, process.env.JWT_SECRET)
      // @ts-ignore
      req.user = await this.userService.getUserById(user.id)
      next()
    } catch (error) {
      req.user = null
      next()
    }
  }
}