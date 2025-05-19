import { Inject, Injectable } from "@nestjs/common";
import Category from "src/database/entities/Category.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class CategoryRepository extends Repository<Category> {
    constructor(private dataSource: DataSource) {
        super(Category, dataSource.createEntityManager());
    }
}