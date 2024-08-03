import {Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, BaseEntity, IntegerType} from 'typeorm';

@Entity()
export class Schedule extends BaseEntity {
    @PrimaryColumn('bigint')
    id!: number;

    @Column('bigint')
    user_id!: number;

    @Column()
    content!: string;

    @Column()
    title!: string;

    @Column()
    create_date!: string;

    @Column()
    due_date!: string;

    @Column()
    is_finished!: number;

    @Column({
        type: String,
        nullable: true,
    })
    finish_time!: string | null;
}