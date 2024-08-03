import {Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, BaseEntity, IntegerType} from 'typeorm';

@Entity()
export class BookNotes extends BaseEntity {
    @PrimaryColumn('bigint')
    id!: number;

    @Column('bigint')
    user_id!: number;

    @Column('bigint')
    book_id!: number;

    @Column('text', {
        nullable: true,
    })
    content!: string | null;

    @Column()
    create_date!: string;

    @Column({
        type: String,
        nullable: true,
    })
    update_time!: string | null;

    @Column()
    is_delete!: number;

    @Column({
        type: String,
        nullable: true,
    })
    delete_time!: string | null;
}