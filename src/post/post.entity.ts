import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '../comment/comment.entity'; // <--- Import Comment
import { User } from '../user/user.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(() => User, (user) => user.posts)
    user: User;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];  
}
