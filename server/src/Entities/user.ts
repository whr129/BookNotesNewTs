import {Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, BaseEntity, IntegerType} from 'typeorm';

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn('bigint')
    user_id!: number;

    @Column()
    user_name!: string;

    @Column()
    create_time!: string;

    @Column({
        type: String,
        nullable: true,
    })
    delete_time!: string | null;

    @Column()
    is_delete!: number;

    @Column()
    email!: string;

    @Column()
    phone_number!: string;

    @Column()
    password!: string;

}