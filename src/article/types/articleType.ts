import { ArticleEntity } from "../article.entity"
// Omit через те, що в результаті роботи спред оператора методи не повертаються а тільки поля
export type ArticleType = Omit<ArticleEntity, 'updateTime'> & { favorited?: boolean }
