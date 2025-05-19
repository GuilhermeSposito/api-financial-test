import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/users/user.UserRepository';
import { AuthReponseDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import { UserLoginDto } from './dto/user.dto.login';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
    private jwtExpiresInSeconds: number;
    constructor(private readonly userService: UsersService, private readonly jwtService: JwtService, private readonly configService: ConfigService) {
        this.jwtExpiresInSeconds = parseInt(this.configService.get<string>("JWT_EXPIRATION")!, 10)
    }

    async signIn(userAuthDto: UserLoginDto): Promise<AuthReponseDto> {
        try {
            const existUser: boolean = await this.userService.ExistUser(userAuthDto)
            if (!existUser)
                throw new UnauthorizedException()

            const FindedUser = await this.userService.searchUserByEmail(userAuthDto.email)
            if (!FindedUser)
                throw new UnauthorizedException()

            const verifyPassword: boolean = await this.userService.VerifyPassword(FindedUser, userAuthDto.password)

            if (!verifyPassword)
                throw new UnauthorizedException()

            const payload = { id: FindedUser.id, email: FindedUser.email }
            const token = this.jwtService.sign(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: this.jwtExpiresInSeconds
            })


            return {
                sucess: true,
                token: token,
                expiresIn: this.jwtExpiresInSeconds
            }
        } catch (eror) {

            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)

        }
    }
}
