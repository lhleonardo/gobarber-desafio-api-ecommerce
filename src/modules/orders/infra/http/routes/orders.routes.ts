import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import OrdersController from '../controller/OrdersController';

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      customer_id: Joi.string().uuid().required(),
      products: Joi.array()
        .items(
          Joi.object({
            id: Joi.string().uuid().required(),
            quantity: Joi.number().integer().min(1).required(),
          }),
        )
        .min(1)
        .required(),
    },
  }),
  ordersController.create,
);
ordersRouter.get('/:id', ordersController.show);

export default ordersRouter;
