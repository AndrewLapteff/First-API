import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedDB_1682339008369 implements MigrationInterface {
    name = 'SeedDB_1682339008369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO tags (name) VALUES ('food'), ('travel')`
        )
        // password = 'qwerty'
        await queryRunner.query(
            `INSERT INTO users (username, email, password) VALUES ('foo', 'test@gmail.com', '$2b$10$sAiPWbAMw.rTCExfvLoIHuYUB0asyr2FYHPXvVNcpSOxg6TmoC2i6')`
        )
        await queryRunner.query(
            `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First-article', 'itz first article', 'itz body', 'food,travel', 1)`
        )
        await queryRunner.query(
            `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('second-article', 'Second-article', 'itz second article', 'itz another body', 'travel,food', 1)`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
