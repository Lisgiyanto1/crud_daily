import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid token');
        }

        const token = authHeader.split(' ')[1];
        const user = await this.userRepository.findOne({ where: { token } });

        if (!user) {
            throw new UnauthorizedException('Invalid token');
        }

        const now = new Date();
        const lastActive = user.last_active ?? new Date(0);

        const hoursDiff = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
        if (hoursDiff > 10) {
            user.token = '';
            user.last_active = new Date(0);
            await this.userRepository.save(user);
            throw new UnauthorizedException('Session expired');
        }

        user.last_active = now;
        await this.userRepository.save(user);

        request['user'] = user;
        return true;
    }
}
