import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return false;
        }

        const token = authHeader.split(' ')[1];
        const user = await this.userRepository.findOne({ where: { token } });

        if (!user) {
            return false;
        }

        request['user'] = user; 
        return true;
    }
}
