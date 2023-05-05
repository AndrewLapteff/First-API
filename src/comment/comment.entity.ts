import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { ArticleEntity } from "../article/article.entity"
import { UserEntity } from "../user/user.entity"

@Entity({ name: 'comments' })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => UserEntity, user => user.comments, { eager: true })
  author: UserEntity

  @ManyToOne(() => ArticleEntity, article => article.comments)
  article: ArticleEntity

  @Column()
  body: string
}