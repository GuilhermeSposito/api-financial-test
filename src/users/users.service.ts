import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from './user.UserRepository';
import { User } from 'src/database/entities/User.entity';
import { hash as bcryptHashAsync, compare } from 'bcrypt'
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { UserLoginDto } from '../auth/dto/user.dto.login'

@Injectable()
export class UsersService {

  constructor(
    private readonly userRepository: UserRepository
  ) { }

  async create(createUserDto: CreateUserDto) {

    const FindForUser: User | null = await this.userRepository.findOneBy({
      email: createUserDto.email
    })

    if (FindForUser)
      throw new ConflictException({ error: "User with this email is already registered" })

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

  async findOne(id: string) {
    const FindedUser: User | null = await this.userRepository.findOne({
      where: { id: id }
    })

    return FindedUser
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `Se você esta lendo isso deu certo a automação do deploy no servidor`;
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
}
