import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'name', nullable: false })
    public name: string

    @Column({ name: 'email', unique: true, nullable: false })
    email: string

    @Column({ name: 'password', nullable: false })
    password: string

    @Column({ name: 'ativo', default: false })
    ativo: boolean


}