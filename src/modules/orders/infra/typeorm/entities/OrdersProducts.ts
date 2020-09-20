import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import Order from '@modules/orders/infra/typeorm/entities/Order';
import Product from '@modules/products/infra/typeorm/entities/Product';

@Entity('orders_products')
class OrdersProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => Order, order => order.order_products)
  order: Order;

  @ManyToOne(type => Product, product => product.order_products)
  product: Product;

  @Column('uuid')
  productId: string;

  @Column('uuid')
  orderId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column('integer')
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default OrdersProducts;
