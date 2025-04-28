import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/post/post.entity';
import { UserModule } from 'src/user/user.module';
import { CommentController } from './comment.controller';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Comment, Post]),

        UserModule,
    ],
    providers: [CommentService],
    controllers: [CommentController],
})
export class CommentModule { }
