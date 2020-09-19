import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ProductsController from '../controller/ProductsController';

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().required(),
      quantity: Joi.number().integer().required(),
    },
  }),
  productsController.create,
);

export default productsRouter;
