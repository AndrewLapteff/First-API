import { Module } from '@nestjs/common'
import { CommentController } from './comment.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommentEntity } from '@app/comment/comment.entity'
import { ArticleEntity } from '@app/article/article.entity'
import { UserEntity } from '@app/user/user.entity'
import { CommentService } from './comment.service'

@Module({ imports: [ TypeOrmModule.forFeature([ CommentEntity, ArticleEntity, UserEntity ]) ], controllers: [ CommentController ], providers: [ CommentService ] })
export class CommentModule { }
