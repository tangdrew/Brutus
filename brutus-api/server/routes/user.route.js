import express from 'express';
import validate from 'express-validation';
import { UserValidation } from '../models/user.model';
import userCtrl from '../controllers/user.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(userCtrl.list)

  /** POST /api/users - Create new user */
  .post(validate(UserValidation.createUser), userCtrl.create);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(validate(UserValidation.updateUser), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.remove);

router.route('/email/:email')
  /** GET /api/users/email/:email - Get user by email */
  .get(userCtrl.get);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

/** Load user when API with email route parameter is hit */
router.param('email', userCtrl.emailLoad);

export default router;
