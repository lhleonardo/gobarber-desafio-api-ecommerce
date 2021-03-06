import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const products = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return products;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const result = await this.ormRepository.find({
      where: { id: In(products.map(element => element.id)) },
    });

    return result;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    // TODO: Atualizar a quantidade dos produtos.
    const productsId = products.map(product => product.id);
    const persistedProducts = await this.ormRepository.find({
      where: {
        id: In(productsId),
      },
    });

    const toSave = persistedProducts.map(product => {
      const toUpdate = products.find(p => p.id === product.id)!!;

      return {
        ...product,
        quantity: product.quantity - toUpdate.quantity,
      };
    });

    const saved = await this.ormRepository.save(toSave);
    return saved;
  }
}

export default ProductsRepository;
