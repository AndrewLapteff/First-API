import { Injectable } from "@nestjs/common"

@Injectable()
export class UserService{
  async registration(){
    return {nam: 'service'}
  }
}