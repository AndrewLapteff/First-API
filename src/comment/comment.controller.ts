import { createCommentDto } from "@app/article/dto/createComment.dto"
import { User } from "@app/user/decorators/user.decorator"
import { AuthGuard } from "@app/user/guards/auth.guard"
import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"
import { CommentService } from "./comment.service"
import { CommentEntity } from "./comment.entity"

@Controller('articles')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }
  @Post(':slug/comment')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createComment(@User('id') currentUserId: number, @Param('slug') slug: string, @Body() commentBody: createCommentDto): Promise<{ comment: { body: string } }> {
    const comment: string = await this.commentService.createComment(currentUserId, slug, commentBody)
    return this.commentService.buildCommentResponse(comment)
  }
  @Get(':slug/comments')
  @UseGuards(AuthGuard)
  async getComments(@Param('slug') slug: string): Promise<{ comments: CommentEntity[] }> {
    const comments: CommentEntity[] = await this.commentService.getComments(slug)
    return this.commentService.buildCommentsResponse(comments)
  }
  @Delete(':slug/comments/:id')
  @UseGuards(AuthGuard)
  async deleteComment(@Param('id') id: number): Promise<void> {
    await this.commentService.deleteComment(id)
    return
  }
}