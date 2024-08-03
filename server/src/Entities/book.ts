import {Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, BaseEntity, IntegerType} from 'typeorm';

@Entity()
export class Book extends BaseEntity {
    @PrimaryColumn('bigint')
    id!: number;

    @Column({
        type: String,
        nullable: true,
    })
    update_time!: string | null;

    @Column()
    create_time!: string;

    @Column({
        type: String,
        nullable: true,
    })
    begin_time!: string | null;

    @Column({
        type: String,
        nullable: true,
    })
    end_time!: string | null;

    //0: unread, 1: in progress, 2: finished
    @Column()
    status!: number;

    @Column()
    author!: string;

    @Column({
        type: Number,
        nullable: true,
    })
    page!: number | null;

    @Column({
        type: Number,
        nullable: true,
    })
    read_page!: number | null;

    @Column()
    book_name!: string;

    @Column('bigint')
    user_id!: number;

    @Column()
    is_delete!: number;

    @Column({
        type: String,
        nullable: true,
    })
    delete_time!: string | null;

    @Column('text')
    pic_url!: string;

    @Column({
        type: Number,
        nullable: true,
    })
    rate!: number | null;
}