import Customer from '@modules/customers/infra/typeorm/entities/Customer';

interface IProduct {
  productId: string;
  price: number;
  quantity: number;
}

export default interface ICreateOrderDTO {
  customer: Customer;
  products: IProduct[];
}
