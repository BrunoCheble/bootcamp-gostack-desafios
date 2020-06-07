import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ProfileControllers from '../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileControllers();

profileRouter.use(ensureAuthenticated);
profileRouter.put(
  '/',
  celebrate({
    body: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileController.update,
);
profileRouter.get('/', profileController.show);

export default profileRouter;
