import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { CommentEntity } from "./comment.entity"
import { ArticleEntity } from "@app/article/article.entity"
import { createCommentDto } from "@app/article/dto/createComment.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UserEntity } from "@app/user/user.entity"

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(CommentEntity) private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) { }
  async getComments(slug: string): Promise<CommentEntity[]> {
    const article: ArticleEntity = await this.articleRepository.findOne({ where: { slug } })
    if (!article)
      return []
    return article.comments
  }

  async createComment(currentUserId: number, slug: string, commentBody: createCommentDto): Promise<string> {
    const article: ArticleEntity = await this.articleRepository.findOne({ where: { slug } })
    const currentUser: UserEntity = await this.userRepository.findOne({ where: { id: currentUserId } })
    if (!article)
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND)
    const comment = new CommentEntity()
    comment.article = article
    comment.author = currentUser
    comment.body = commentBody.body
    await this.commentRepository.save(comment)
    return commentBody.body
  }

  async deleteComment(id: number): Promise<void> {
    const comment: CommentEntity = await this.commentRepository.findOne({ where: { id } })
    if (!comment)
      throw new HttpException('Comment not fount', HttpStatus.NOT_FOUND)
    await this.commentRepository.delete({ id })
    return
  }

  buildCommentResponse(commentBody: string) {
    return { comment: { body: commentBody } }
  }

  buildCommentsResponse(comments: CommentEntity[]) {
    return { comments }
  }

}