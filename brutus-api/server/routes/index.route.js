import express from 'express';
import userRoutes from './user.route';
import courseRoutes from './course.route';
import reviewRoutes from './review.route';
import termRoutes from './term.route';
import authRoutes from './auth.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount user routes at /users
router.use('/courses', courseRoutes);

// mount review routes at /reviews
router.use('/reviews', reviewRoutes);

//mount term routes at /terms
router.use('/terms', termRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

export default router;
