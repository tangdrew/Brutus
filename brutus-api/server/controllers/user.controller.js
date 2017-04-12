import User from '../models/user.model';

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Load user by email and append to req.
 */
function emailLoad(req, res, next, id) {
  User.getByEmail(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User({
    // email: req.body.email,
    // gradYear: req.body.gradYear,
    // majors: req.body.majors,
    // minors: req.body.minors,
    // coursesTaken: req.body.coursesTaken,
    // currentCourses: req.body.currentCourses,
    // auth0Id: req.body.auth0Id
    email: req.body.email,
    auth0Id: req.body.auth0Id,
    courses: req.body.courses
  });

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  // user.email = req.body.email;
  // user.gradYear = req.body.gradYear;
  // user.majors = req.body.majors;
  // user.minors = req.body.minors;
  // user.coursesTaken = req.body.coursesTaken;
  // user.currentCourses = req.body.currentCourse;
  // user.auth0Id = req.body.auth0Id;
  email: req.body.email;
  auth0Id: req.body.auth0Id;
  courses: req.body.courses;

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

export default { load, emailLoad, get, create, update, list, remove };
