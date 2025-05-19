import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/users/user.decorator';
import { User as UserType } from 'src/database/entities/User.entity';
import { CreateCategoryDto } from './dtos/create.category.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UpdateCategoryDto } from './dtos/update.category.dto';

@UseGuards(AuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  async GetCategoriesByUser(@User() user: UserType) {
    return await this.categoriesService.GetAll(user);
  }

  @Post()
  async CreateCategory(@User() user: UserType, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.Create(user, createCategoryDto);
  }

  @Put()
  async UpdateCategory(@User() user: UserType, @Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.categoriesService.UpdateCategory(user, updateCategoryDto)
  }
}
