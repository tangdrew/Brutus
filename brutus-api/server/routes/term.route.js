import express from 'express';
import validate from 'express-validation';
import { TermValidation } from '../models/term.model';
import termCtrl from '../controllers/term.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/terms - Get list of terms */
  .get(termCtrl.list)

  /** POST /api/terms - Create new term */
  .post(validate(TermValidation.createTerm), termCtrl.create);

router.route('/:termId')
  /** GET /api/terms/:termId - Get term */
  .get(termCtrl.get)

  /** PUT /api/terms/:termId - Update term */
  .put(validate(TermValidation.updateTerm), termCtrl.update)

  /** DELETE /api/terms/:termId - Delete term */
  .delete(termCtrl.remove);

/** Load term when API with termId route parameter is hit */
router.param('termId', termCtrl.load);

export default router;
