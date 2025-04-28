import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from 'src/comment/comment.controller';
import { Comment } from 'src/comment/comment.entity';
import { CommentService } from 'src/comment/comment.service';
import { UserModule } from 'src/user/user.module';
import { PostController } from './post.controller';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, Comment]),
        UserModule
    ],
    providers: [PostService, CommentService],
    controllers: [PostController, CommentController],
})
export class PostModule { }
