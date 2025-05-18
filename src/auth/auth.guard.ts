import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSecret: string;
  constructor(private readonly jwtService: JwtService, configService: ConfigService) {
    this.jwtSecret = configService.get<string>("JWT_SECRET")!;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //acessar a requisição
    const request = context.switchToHttp().getRequest()
    const Token = this.extractTokenFromTheHeader(request)


    if (!Token)
      throw new UnauthorizedException(Token)

    try {
      const payload = await this.jwtService.verifyAsync(
        Token, {
        secret: this.jwtSecret
      })

      request['user'] = payload;

    } catch (error) {
      throw new UnauthorizedException()
    }
    return true;
  }

  private extractTokenFromTheHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];

    return type == 'Bearer' ? token : undefined
  }

}
