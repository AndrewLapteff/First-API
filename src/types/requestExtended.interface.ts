import { UserEntity } from "@app/user/user.entity"
import { Request } from "express"

export interface RequestExtended extends Request {
  user?: UserEntity
}