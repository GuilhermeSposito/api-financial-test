import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSecret: string;
  constructor(private readonly jwtService: JwtService, configService: ConfigService, private readonly reflector: Reflector) {
    this.jwtSecret = configService.get<string>("JWT_SECRET")!;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) return true;


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
    } catch {
      throw new HttpException('internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  private extractTokenFromTheHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];

    return type == 'Bearer' ? token : undefined
  }

}
