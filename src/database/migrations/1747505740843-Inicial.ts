import { MigrationInterface, QueryRunner } from "typeorm";

export class Inicial1747505740843 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)

        await queryRunner.query(`
            CREATE TABLE users(
                id uuid NOT NULL DEFAULT uuid_generate_v4(),
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                ativo BOOLEAN DEFAULT false,
                CONSTRAINT users_pk2 PRIMARY KEY (id)
            )
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS users`)
    }

}
