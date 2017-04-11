import express from 'express';
import validate from 'express-validation';
import { CourseValidation } from '../models/course.model';
import courseCtrl from '../controllers/course.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/courses - Get list of courses */
  .get(courseCtrl.list)

  /** POST /api/courses - Create new course */
  .post(validate(CourseValidation.createCourse), courseCtrl.create);

router.route('/:courseId')
  /** GET /api/courses/:courseId - Get course */
  .get(courseCtrl.get)

  /** PUT /api/courses/:courseId - Update course */
  .put(validate(CourseValidation.updateCourse), courseCtrl.update)

  /** DELETE /api/courses/:courseId - Delete course */
  .delete(courseCtrl.remove);

/** Load course when API with courseId route parameter is hit */
router.param('courseId', courseCtrl.load);

export default router;
