import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
    ) {}

    async create(postId: number, content: string, user: User): Promise<Comment> {
        const post = await this.postRepository.findOne({ where: { id: postId } });
        if (!post) {
            throw new Error('Post not found');
        }

        const comment = this.commentRepository.create({
            content,
            post,
            user,
        });

        return this.commentRepository.save(comment);
    }

    async findByPost(postId: number): Promise<Comment[]> {
        return this.commentRepository.find({
            where: { post: { id: postId } },
            relations: ['user'],
        });
    }
}
