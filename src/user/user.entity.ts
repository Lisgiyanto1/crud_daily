import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: ['user', 'admin'],
        default: 'user'
    })
    role: 'user' | 'admin';

    @Column({ type: 'json', nullable: true })
    work_identity: {
        no_employee?: string;
        company?: string;
        position?: string;
        start_date?: Date;
        end_date?: Date;
    }[];


    @Column({ unique: true, nullable: true })
    token: string;

    @Column({type: 'timestamp', nullable: true})
    last_active: Date;
}
