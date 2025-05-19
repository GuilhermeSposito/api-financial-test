import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Category from 'src/database/entities/Category.entity';
import { CategoryRepository } from './categories.CategoryRepository';
import { UserRepository } from 'src/users/user.UserRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryRepository, UserRepository],
})
export class CategoriesModule { }
