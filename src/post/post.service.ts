import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from './post.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
    ) {}

    async create(content: string, user: User): Promise<Post> {
        const post = this.postRepository.create({ content, user });
        return this.postRepository.save(post);
    }

    async findAll(): Promise<Post[]> {
        return this.postRepository.find({ relations: ['user'] });
    }
}
