import { MigrationInterface, QueryRunner } from "typeorm"

export class Auto1682408460364 implements MigrationInterface {
    name = 'Auto1682408460364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE users_id_seq START 1;`)

        await queryRunner.query(`CREATE TABLE "users" ("id" INTEGER DEFAULT nextval('users_id_seq'::regclass) NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "bio" character varying NOT NULL DEFAULT '', "image" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`)
    }

}
