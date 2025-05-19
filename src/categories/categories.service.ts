import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryRepository } from './categories.CategoryRepository';
import { User } from 'src/database/entities/User.entity';
import { CreateCategoryDto } from './dtos/create.category.dto';
import { UserRepository } from 'src/users/user.UserRepository';
import Category from 'src/database/entities/Category.entity';
import { UpdateCategoryDto } from './dtos/update.category.dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly categoriesRepository: CategoryRepository, private readonly userRepository: UserRepository) { }

    async GetAll(user: User) {
        try {
            const FindedUser = await this.userRepository.findOne({ where: { id: user.id }, relations: ['categories'] })

            return FindedUser?.categories
        } catch (error) {

            throw new HttpException(this.userRepository.ReturnErrorString("InternalError").description, HttpStatus.INTERNAL_SERVER_ERROR)

        }
    }

    async Create(user: User, createCategoryDto: CreateCategoryDto) {
        //se chegar aqui é porque esta autenticado e tem o payload valido
        try {
            const Createdcategory = await this.categoriesRepository.create({
                description: createCategoryDto.description,
                user: { id: user.id }
            })

            return await this.categoriesRepository.save(Createdcategory)
        } catch (error) {

            throw new HttpException(this.userRepository.ReturnErrorString("InternalError").description, HttpStatus.INTERNAL_SERVER_ERROR)

        }
    }

    async UpdateCategory(user: User, updateCategory: UpdateCategoryDto) {

    }
}
