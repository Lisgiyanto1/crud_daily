import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { Repository } from "typeorm";
import { User } from "./user.entity";
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async register(name: string, email: string, password: string): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestException("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ name, email, password: hashedPassword });
        return this.userRepository.save(user);
    }

    async login(email: string, password: string): Promise<{ token: string }> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const newToken = randomUUID();
        user.token = newToken;
        user.last_active = new Date();

        await this.userRepository.save(user);
        return { token: newToken };
    }

    async updateWorkIdentity(
        email: string,
        password: string,
        work_identity: {
            no_employee?: string;
            company?: string;
            position?: string;
            start_date?: Date;
            end_date?: Date;
        }[]
    ): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        user.work_identity = work_identity;
        return this.userRepository.save(user);
    }

    async logout(token: string): Promise<{ message: string }> {
        const user = await this.userRepository.findOne({ where: { token } });
        if (!user) throw new UnauthorizedException('Invalid token');

        user.token = '';
        user.last_active = new Date(0);
        await this.userRepository.save(user);

        return { message: 'Logged out' };
    }
}
