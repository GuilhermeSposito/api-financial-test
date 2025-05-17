import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from './user.UserRepository';
import { User } from 'src/database/entities/User.entity';

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

    const newUser: User = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password
    })

    await this.userRepository.save(newUser)

  }

  async findAll(): Promise<User[] | undefined> {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    const FindedUser: User[] | undefined = await this.userRepository.findBy({
      id: id
    })

    if (!FindedUser)
      return {}
    else {
      return FindedUser
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `Se você esta lendo isso deu certo a automação do deploy no servidor`;
  }
}
