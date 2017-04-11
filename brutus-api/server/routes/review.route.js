import express from 'express';
import validate from 'express-validation';
import { ReviewValidation } from '../models/review.model';
import reviewCtrl from '../controllers/review.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/reviews - Get list of reviews */
  .get(reviewCtrl.list)

  /** POST /api/reviews - Create new review */
  .post(validate(ReviewValidation.createReview), reviewCtrl.create);

router.route('/:reviewId')
  /** GET /api/reviews/:reviewId - Get review */
  .get(reviewCtrl.get)

  /** PUT /api/reviews/:reviewId - Update review */
  .put(validate(ReviewValidation.updateReview), reviewCtrl.update)

  /** DELETE /api/reviews/:reviewId - Delete review */
  .delete(reviewCtrl.remove);

/** Load review when API with reviewId route parameter is hit */
router.param('reviewId', reviewCtrl.load);

export default router;
