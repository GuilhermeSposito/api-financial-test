import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategories1747577538718 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
                        CREATE TABLE categories (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            description VARCHAR NOT NULL,
            user_id uuid,
            CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
            ON DELETE CASCADE ON UPDATE CASCADE
        );
            `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
                        DROP TABLE IF EXISTS categories
            `)
    }

}
