import { MigrationInterface, QueryRunner } from "typeorm"

export class Auto1683205686621 implements MigrationInterface {
    name = 'AddedFollowsTable1683205686621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE follows_id_seq START 1;`)
        await queryRunner.query(`CREATE TABLE "follows" ("id" INTEGER DEFAULT nextval('follows_id_seq'::regclass) NOT NULL, "followerId" integer NOT NULL, "followingId" integer NOT NULL, CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "follows"`)
    }

}
