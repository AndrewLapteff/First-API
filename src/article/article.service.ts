import { UserEntity } from "@app/user/user.entity"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { CreateArticleDto } from "./dto/createArticle.dto"
import { ArticleEntity } from "./article.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { DeleteResult, Repository } from "typeorm"
import slugify from "slugify"
import { ArticlesResponse } from "./types/articlesResponse"
import { FollowEntity } from "@app/profile/follow.entity"


@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>) { }

  async create(currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    const article = new ArticleEntity()
    Object.assign(article, createArticleDto)
    if (!article.tagList) {
      article.tagList = []
    }
    article.slug = this.getSlug(article.title)
    console.log(article.slug)
    article.author = currentUser
    return await this.articleRepository.save(article)
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ where: { slug } })
  }

  async delete(slug: string, user: UserEntity): Promise<DeleteResult> {
    const article = await this.findBySlug(slug)
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND)
    }
    if (article.author.id !== user.id) {
      throw new HttpException('You are not author', HttpStatus.FORBIDDEN)
    }
    return await this.articleRepository.delete({ slug })
  }

  async findAll(currentUserId: number, query: any): Promise<ArticlesResponse> {
    const queryBuilder = this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')

    if (query.tag) { // DB: tagList = react,angular,vue,nodejs
      queryBuilder.andWhere('articles.tagList LIKE :tag', { tag: `%${query.tag}%` })
    }
    if (query.author) {
      const user = await this.userRepository.findOne({ where: { username: query.author } })
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      }
      queryBuilder.andWhere('articles.authorId = :id', { id: user.id })
    }
    if (query.favorited) {
      const currentUser = await this.userRepository.findOne({ where: { username: query.favorited }, relations: [ 'favorites' ] })
      let ids: number[] = []
      if (currentUser) {
        ids = currentUser.favorites.map(article => article.id)
      } else {
        queryBuilder.andWhere('1=0')
      }
      if (ids.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids })
      } else {
        queryBuilder.andWhere('1=0')
      }
    }
    if (query.offset) {
      queryBuilder.offset(query.offset)
    }
    if (query.limit) {
      queryBuilder.limit(query.limit)
    }

    const articlesCount: number = await queryBuilder.getCount()
    queryBuilder.orderBy('articles.createdAt', 'DESC')
    const articles: ArticleEntity[] = await queryBuilder.getMany()

    if (currentUserId) {
      const currentUser = await this.userRepository.findOne({ where: { id: currentUserId }, relations: [ 'favorites' ] })
      const favoritedIds = currentUser.favorites.map(article => article.id)
      const articlesWithFavoriteFields = articles.map(article => {
        const favorited: boolean = favoritedIds.includes(article.id)
        return { ...article, favorited }
      })
      return { articles: articlesWithFavoriteFields, articlesCount }
    }
    return { articles, articlesCount }
  }

  async addFavoriveArticle(currentUserId: number, slug: string) {
    const article = await this.findBySlug(slug)
    const user = await this.userRepository.findOne({ where: { id: currentUserId }, relations: [ 'favorites' ] })
    const isArticleFavorited: boolean = user.favorites.findIndex(
      articleInFavorites => articleInFavorites.id === article.id) === -1
    if (isArticleFavorited) {
      user.favorites.push(article)
      article.favoritesCount++
      await this.userRepository.save(user)
      await this.articleRepository.save(article)
    }
    return this.buildArticleResponse(article)
  }

  async deleteFavoriveArticle(currentUserId: number, slug: string) {
    const article = await this.findBySlug(slug)
    const user = await this.userRepository.findOne({ where: { id: currentUserId }, relations: [ 'favorites' ] })
    const indexOfArticle = user.favorites.findIndex(favoriteArticle => favoriteArticle.id === article.id)
    if (indexOfArticle >= 0) {
      user.favorites.splice(indexOfArticle, 1)
      article.favoritesCount--
      this.userRepository.save(user)
      this.articleRepository.save(article)
    }
    return this.buildArticleResponse(article)
  }

  async getFeed(currentUserId: number) {
    const followings = await this.followRepository.find({ where: { followerId: currentUserId } })
    if (followings.length === 0) {
      return { articles: [], articlesCount: 0 }
    }
    const followingsIds = followings.map(item => item.followingId)

    const queryBuilder = this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')

    queryBuilder.andWhere('articles.author.id IN (:...ids)', { ids: followingsIds })
    const articles = await queryBuilder.getMany()
    const articlesCount = await queryBuilder.getCount()
    return { articles: articles, articlesCount: articlesCount }
  }

  buildArticleResponse(article: ArticleEntity) {
    return { article }
  }

  private getSlug(title: string) {
    return slugify(title, { lower: true }) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
  }
}