import { AuthGuard } from "@app/user/guards/auth.guard"
import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"
import { ArticleService } from "./article.service"

@Controller()
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }
  @Post('article')
  @UseGuards(AuthGuard)
  // @UsePipes(new ValidationPipe())
  async createArticle(@Body() body) {
    console.log(body)
    return this.articleService.create()
  }
}