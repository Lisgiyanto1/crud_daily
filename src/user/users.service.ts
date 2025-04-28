import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
            throw new Error("User already exists");
        }

        const user = this.userRepository.create({name, email, password });
        return this.userRepository.save(user);
    }

    async login(email: string, password: string): Promise<{ token: string }> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user || user.password !== password) {
            throw new Error("Invalid credentials");
        }
        const generateToken = randomUUID();
        user.token = generateToken;
        await this.userRepository.save(user);
    
        return { token: generateToken };
    }
    

}