import {Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, BaseEntity, IntegerType} from 'typeorm';

@Entity()
export class SignIn extends BaseEntity {
    @PrimaryColumn('bigint')
    id!: number;

    @Column('bigint')
    user_id!: number;

    @Column()
    sign_in_date!: string;

}