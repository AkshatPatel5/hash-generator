import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ResultStatusEnum {
  PENDING = 'pending',
  NOTFOUND = 'notfound',
  COMPLETED = 'completed',
}

@Entity('hash_table', { schema: 'public' })
export class Hash extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('character varying', { nullable: true, length: 255 })
  input_hex: string;

  @Column({ type: 'bigint', nullable: true, default: '0' })
  nonce: string;

  @Column({ type: 'bigint', nullable: true, default: '0' })
  last_process_nonce: string;

  @Column('character varying', { nullable: true, length: 255 })
  ip_address: string;

  @Column('character varying', { nullable: true, length: 255 })
  output_hex: string;

  @Column({ type: 'enum', enum: ResultStatusEnum })
  status!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
