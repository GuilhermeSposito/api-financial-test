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

type errorString = {
  id: string
  description: string
}

@Injectable()
export class UsersService {

  private errorStrings: errorString[] = [
    { id: 'NotFoundUser', description: 'The current User Was Not Founded' },
    { id: 'EmailExists', description: 'User with this email is already registered' },
    { id: 'IdType', description: `the id's type is not valid` },
    { id: 'ErrorToUpdateaUser', description: `there is some error to update a user, check the sended informations` },
  ]

  constructor(
    private readonly userRepository: UserRepository
  ) { }

  async create(createUserDto: CreateUserDto) {

    const FindForUser: User | null = await this.userRepository.findOneBy({
      email: createUserDto.email
    })

    if (FindForUser)
      throw new HttpException(this.ReturnErrorString("EmailExists").description, HttpStatus.CONFLICT)

    const hashPassWord: string = await bcryptHashAsync(createUserDto.password, 10);

    const newUser: User = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashPassWord
    })

    await this.userRepository.save(newUser)

  }


  async findAll(): Promise<User[] | undefined> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    if (!IsUUID(id)) {
      throw new HttpException(this.ReturnErrorString("IdType").description, HttpStatus.BAD_REQUEST)
    }


    const FindedUser: User | null = await this.userRepository.findOne({
      where: { id: id }
    })

    return FindedUser
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!IsUUID(id))
      throw new HttpException(this.ReturnErrorString("IdType").description, HttpStatus.BAD_REQUEST)

    const UserTOModify = await this.findOne(id);

    if (!UserTOModify)
      throw new HttpException(this.ReturnErrorString("NotFoundUser").description, HttpStatus.NOT_FOUND)

    UserTOModify.email = updateUserDto.email;
    UserTOModify.name = updateUserDto.name
    UserTOModify.ativo = updateUserDto.ativo;

    await this.userRepository.save(UserTOModify!)
  }

  async updatePartialUser(id: string, updateUserDto: UpdateUserDto) {
    if (!IsUUID(id)) {
      throw new HttpException(this.ReturnErrorString("IdType").description, HttpStatus.BAD_REQUEST)
    }

    const findedUser = await this.userRepository.findOne({
      where: { id: id }
    })

    if (!findedUser)
      throw new HttpException(this.ReturnErrorString("NotFoundUser").description, HttpStatus.BAD_REQUEST)

    if (updateUserDto.password) {
      const hashPassWord: string = await bcryptHashAsync(updateUserDto.password, 10);

      updateUserDto.password = hashPassWord
    }


    Object.assign(findedUser, updateUserDto)

    const UpdatedUser = await this.userRepository.save(findedUser)

    if (UpdatedUser)
      return { statusCode: HttpStatus.ACCEPTED, message: "Sucess to update a User" }
    else
      throw new HttpException(this.ReturnErrorString("ErrorToUpdateaUser").description, HttpStatus.BAD_REQUEST)
  }

  async remove(id: string) {
    if (!IsUUID(id)) {
      throw new HttpException(this.ReturnErrorString("IdType").description, HttpStatus.BAD_REQUEST)
    }

    const findedUser = await this.userRepository.findOne({
      where: { id: id }
    })

    if (!findedUser)
      throw new HttpException(this.ReturnErrorString("NotFoundUser").description, HttpStatus.BAD_REQUEST)

    await this.userRepository.remove(findedUser)

  }

  async ExistUser(userAuth: UserLoginDto): Promise<boolean> {
    const FindedUser: User | null = await this.userRepository.findOne({
      where: { email: userAuth.email }
    })

    if (FindedUser)
      return true;
    else
      return false
  }

  async searchUserByEmail(email: string): Promise<User | null> {
    const FindedUser: User | null = await this.userRepository.findOne({
      where: { email: email }
    })

    return FindedUser
  }

  async VerifyPassword(user: User, password: string): Promise<boolean> {
    return await compare(password, user.password)
  }

  ReturnErrorString(id: string): errorString {
    return this.errorStrings.find(x => x.id == id) ?? { id: "notFoundErrorString", description: "errorStringWasNotFounded" }
  }
}