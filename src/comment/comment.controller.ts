import { Body, Controller, Get, Post as HttpPost, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/user/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { CommentService } from './comment.service';

@Controller('posts/:postId/comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @UseGuards(AuthGuard)
    @HttpPost()
    async create(
        @Body('postId') postId: number,
        @Body('content') content: string,
        @Req() request: Request
    ) {
        const user = request['user'] as User;
        return this.commentService.create(postId, content, user);
    }

    @Get()
    async findByPost(@Param('postId') postId: string) {
        return this.commentService.findByPost(Number(postId));
    }
}
