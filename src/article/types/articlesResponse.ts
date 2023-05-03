import { ArticleType } from "./articleType"

export interface ArticlesResponse {
  articles: ArticleType[]
  articlesCount: number
}