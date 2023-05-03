import { Module } from '@nestjs/common'
import { ArticleController } from './article.controller'
import { ArticleService } from './article.service'
import { AuthGuard } from '@app/user/guards/auth.guard'
import { ArticleEntity } from './article.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '@app/user/user.entity'

@Module({
  imports: [ TypeOrmModule.forFeature([ ArticleEntity, UserEntity ]) ],
  controllers: [ ArticleController ],
  providers: [ ArticleService, AuthGuard ]
})
export class ArticleModule { }
