import { Body, Controller, Get, Post as HttpPost, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/user/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @UseGuards(AuthGuard)
    @HttpPost()
    async create(@Body('content') content: string, @Req() request: Request) {
        const user = request['user'] as User; 
        return this.postService.create(content, user);
    }

    @Get()
    async findAll() {
        return this.postService.findAll();
    }
}
