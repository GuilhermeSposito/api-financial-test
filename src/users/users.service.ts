import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from './user.UserRepository';
import { User } from 'src/database/entities/User.entity';
import { hash as bcryptHashAsync, compare } from 'bcrypt'
import { v4 as uuid, validate as IsUUID } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { UserLoginDto } from '../auth/dto/user.dto.login'


@Injectable()
export class UsersService {

  constructor(
    private readonly userRepository: UserRepository
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const FindForUser: User | null = await this.userRepository.findOneBy({
        email: createUserDto.email
      })

      if (FindForUser)
        throw new HttpException(this.userRepository.ReturnErrorString("EmailExists").description, HttpStatus.CONFLICT)

      const hashPassWord: string = await bcryptHashAsync(createUserDto.password, 10);

      const newUser: User = this.userRepository.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashPassWord
      })

      await this.userRepository.save(newUser)
    } catch (error) {

      throw new HttpException(this.userRepository.ReturnErrorString("InternalError").description, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }


  async findAll(): Promise<User[] | undefined> {
    try {
      return await this.userRepository.find();
    }
    catch (error) {

      throw new HttpException(this.userRepository.ReturnErrorString("InternalError").description, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async findOne(id: string): Promise<User | null> {
    try {
      if (!IsUUID(id)) {
        throw new HttpException(this.userRepository.ReturnErrorString("IdType").description, HttpStatus.BAD_REQUEST)
      }


      const FindedUser: User | null = await this.userRepository.findOne({
        where: { id: id }
      })

      return FindedUser
    }
    catch (error) {

      throw new HttpException(this.userRepository.ReturnErrorString("InternalError").description, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (!IsUUID(id))
        throw new HttpException(this.userRepository.ReturnErrorString("IdType").description, HttpStatus.BAD_REQUEST)

      const UserTOModify = await this.findOne(id);

      if (!UserTOModify)
        throw new HttpException(this.userRepository.ReturnErrorString("NotFoundUser").description, HttpStatus.NOT_FOUND)

      UserTOModify.email = updateUserDto.email;
      UserTOModify.name = updateUserDto.name
      UserTOModify.ativo = updateUserDto.ativo;

      await this.userRepository.save(UserTOModify!)
    } catch (error) {

      throw new HttpException(this.userRepository.ReturnErrorString("InternalError").description, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async updatePartialUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (!IsUUID(id)) {
        throw new HttpException(this.userRepository.ReturnErrorString("IdType").description, HttpStatus.BAD_REQUEST)
      }

      const findedUser = await this.userRepository.findOne({
        where: { id: id }
      })

      if (!findedUser)
        throw new HttpException(this.userRepository.ReturnErrorString("NotFoundUser").description, HttpStatus.BAD_REQUEST)

      if (updateUserDto.password) {
        const hashPassWord: string = await bcryptHashAsync(updateUserDto.password, 10);

        updateUserDto.password = hashPassWord
      }


      Object.assign(findedUser, updateUserDto)

      const UpdatedUser = await this.userRepository.save(findedUser)

      if (UpdatedUser)
        return { statusCode: HttpStatus.ACCEPTED, message: "Sucess to update a User" }
      else
        throw new HttpException(this.userRepository.ReturnErrorString("ErrorToUpdateaUser").description, HttpStatus.BAD_REQUEST)
    } catch (error) {

      throw new HttpException(this.userRepository.ReturnErrorString("InternalError").description, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async remove(id: string) {
    try {
      if (!IsUUID(id)) {
        throw new HttpException(this.userRepository.ReturnErrorString("IdType").description, HttpStatus.BAD_REQUEST)
      }

      const findedUser = await this.userRepository.findOne({
        where: { id: id }
      })

      if (!findedUser)
        throw new HttpException(this.userRepository.ReturnErrorString("NotFoundUser").description, HttpStatus.BAD_REQUEST)

      await this.userRepository.remove(findedUser)
    } catch (error) {

      throw new HttpException(this.userRepository.ReturnErrorString("InternalError").description, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async ExistUser(userAuth: UserLoginDto): Promise<boolean> {
    try {
      const FindedUser: User | null = await this.userRepository.findOne({
        where: { email: userAuth.email }
      })

      if (FindedUser)
        return true;
      else
        return false

    } catch (error) {

      throw new HttpException(this.userRepository.ReturnErrorString("InternalError").description, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async searchUserByEmail(email: string): Promise<User | null> {
    try {
      const FindedUser: User | null = await this.userRepository.findOne({
        where: { email: email }
      })

      return FindedUser
    } catch (error) {

      throw new HttpException(this.userRepository.ReturnErrorString("InternalError").description, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async VerifyPassword(user: User, password: string): Promise<boolean> {
    try {
      return await compare(password, user.password)
    } catch (error) {

      throw new HttpException(this.userRepository.ReturnErrorString("InternalError").description, HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }


}