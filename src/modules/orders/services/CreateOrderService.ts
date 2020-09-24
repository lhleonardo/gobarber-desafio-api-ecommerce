import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('O código do cliente é inválido ou inexistente.');
    }

    const storedProducts = await this.productsRepository.findAllById(products);

    if (products.length !== storedProducts.length) {
      throw new AppError(
        `Existem ${
          products.length - storedProducts.length
        } produto(s) informado(s) que não são válidos`,
      );
    }

    if (storedProducts.length === 0) {
      throw new AppError('Não é possível criar um pedido sem produtos.');
    }

    const isNotEnough = storedProducts.filter(({ id, quantity }) => {
      const informedProduct = products.find(informed => informed.id === id);

      if (!informedProduct) {
        return false;
      }

      return quantity < informedProduct?.quantity;
    });

    if (isNotEnough.length > 0) {
      throw new AppError(
        'Há um ou mais produtos com quantidade fora de estoque',
      );
    }

    await this.productsRepository.updateQuantity(products);

    const order = await this.ordersRepository.create({
      customer,
      products: storedProducts.map(stored => {
        const informedProduct = products.find(p => p.id === stored.id)!!;

        return {
          price: stored.price,
          product_id: stored.id,
          quantity: informedProduct.quantity,
        };
      }),
    });

    return order;
  }
}

export default CreateOrderService;
