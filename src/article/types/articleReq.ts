import { Request } from "express"

export interface IArticleRequest extends Request {
  article?: object
}