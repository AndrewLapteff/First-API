import { MigrationInterface, QueryRunner } from "typeorm"

export class Auto1682339008369 implements MigrationInterface {
    name = 'Auto1682339008369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE tags_id_seq START 1;`)
        await queryRunner.query(`CREATE TABLE "tags" (
            "id" INTEGER DEFAULT nextval('tags_id_seq'::regclass) NOT NULL,
            "name" CHARACTER VARYING NOT NULL,
            CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id")
        );`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tags"`)
    }

}
