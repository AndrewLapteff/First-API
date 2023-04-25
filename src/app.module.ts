import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '@app/db.connection'
import { UserModule } from './user/user.module';

@Module({
  imports: [ TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }), TagModule, UserModule ],
  controllers: [ AppController ],
  providers: [ AppService ],
})

export class AppModule { }
