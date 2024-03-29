import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TagModule } from './tag/tag.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from '@app/db.connection'
import { UserModule } from './user/user.module'
import { AuthMiddleware } from './user/middlewares/auth.middleware'
import { ArticleModule } from './article/article.module'
import { ProfileModule } from './profile/profile.module'
import { CommentModule } from './comment/comment.module'

@Module({
  imports: [ TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true },), TagModule, UserModule, ArticleModule, ProfileModule, CommentModule ],
  controllers: [ AppController ],
  providers: [ AppService ],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL
      })
  }
}
