import Review from '../models/review.model';

/**
 * Load review and append to req.
 */
function load(req, res, next, id) {
  Review.get(id)
    .then((review) => {
      req.review = review; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get review
 * @returns {Review}
 */
function get(req, res) {
  return res.json(req.review);
}

/**
 * Create new review
 * @property {string} req.body.reviewname - The reviewname of review.
 * @property {string} req.body.mobileNumber - The mobileNumber of review.
 * @returns {Review}
 */
function create(req, res, next) {
  const review = new Review({
    course: req.body.course,
    course_id: req.body.course_id,
    instructor: req.body.instructor,
    user: req.body.user,
    rating: req.body.rating,
    grade: req.body.grade,
    time: req.body.time,
    comment: req.body.comment
  });

  review.save()
    .then(savedReview => res.json(savedReview))
    .catch(e => next(e));
}

/**
 * Update existing review
 * @property {string} req.body.reviewname - The reviewname of review.
 * @property {string} req.body.mobileNumber - The mobileNumber of review.
 * @returns {Review}
 */
function update(req, res, next) {
  const review = req.review;
  review.course = req.body.course;
  review.course_id = req.body.course_id;
  review.instructor = req.body.instructor;
  review.user = req.body.user;
  review.rating = req.body.rating;
  review.grade = req.body.grade;
  review.time = req.body.time;
  review.comment = req.body.comment;

  review.save()
    .then(savedReview => res.json(savedReview))
    .catch(e => next(e));
}

/**
 * Get review list.
 * @property {number} req.query.skip - Number of reviews to be skipped.
 * @property {number} req.query.limit - Limit number of reviews to be returned.
 * @returns {Review[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 , course} = req.query;
  Review.list({ limit, skip, course })
    .then(reviews => res.json(reviews))
    .catch(e => next(e));
}

/**
 * Delete review.
 * @returns {Review}
 */
function remove(req, res, next) {
  const review = req.review;
  review.remove()
    .then(deletedReview => res.json(deletedReview))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
