import { AuthGuard } from "@app/user/guards/auth.guard"
import { Body, Controller, Delete, Get, Param, Post, UseGuards, Query, UsePipes, ValidationPipe } from "@nestjs/common"
import { ArticleService } from "./article.service"
import { User } from "@app/user/decorators/user.decorator"
import { CreateArticleDto } from "./dto/createArticle.dto"
import { ArticleResponse } from "./types/articleResponse"
import { ArticleEntity } from "./article.entity"
import { UserEntity } from "@app/user/user.entity"
import { DeleteResult } from "typeorm"
import { ArticlesResponse } from "./types/articlesResponse"
import { createCommentDto } from "./dto/createComment.dto"

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }
  @Post()
  @UseGuards(AuthGuard)
  async createArticle(@User() currentUser, @Body('article') createArticleDto: CreateArticleDto): Promise<ArticleResponse> {
    const article = await this.articleService.create(currentUser, createArticleDto)
    return this.articleService.buildArticleResponse(article)
  }
  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(@User('id') currentUserId: number) {
    return await this.articleService.getFeed(currentUserId)
  }
  @Get(':slug')
  async getArticle(@Param('slug') slug: string): Promise<ArticleResponse> {
    const article: ArticleEntity = await this.articleService.findBySlug(slug)
    return this.articleService.buildArticleResponse(article)
  }
  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(@Param('slug') slug: string, @User() user: UserEntity): Promise<DeleteResult> {
    return await this.articleService.delete(slug, user)
  }
  @Get('all')
  async findAll(@User('id') currentUserId: number, @Query() query: any): Promise<ArticlesResponse> {
    return this.articleService.findAll(currentUserId, query)
  }
  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addFavoriveArticle(@User('id') currentUserId: number, @Param('slug') slug: string): Promise<ArticleResponse> {
    return await this.articleService.addFavoriveArticle(currentUserId, slug)
  }
  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async deleteFavoriveArticle(@User('id') currentUserId: number, @Param('slug') slug: string): Promise<ArticleResponse> {
    return await this.articleService.deleteFavoriveArticle(currentUserId, slug)
  }

}