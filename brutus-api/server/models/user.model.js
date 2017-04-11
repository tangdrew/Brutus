import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Joi from 'joi';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  gradYear: {
    type: Number
  },
  majors: [String],
  minors: [String],
  coursesTaken: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  currentCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  auth0Id: {
    type: String,
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * Get user by email
   * @param {ObjectId} email - The email of user.
   * @returns {Promise<User, APIError>}
   */
  getByEmail(email) {
    return this.findOne({'email': email})
      .exec()
      .then((user) => {
        console.log(user);
        if (user) {
          return user;
        }
        const err = new APIError('No user with email', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);

/**
 * User route validation
 */
export const UserValidation = {
  // POST /api/users
  createUser: {
    body: {
      email: Joi.string().required(),
      gradYear: Joi.number(),
      majors: Joi.any(),
      minors: Joi.any(),
      coursesTaken: Joi.any(),
      currentCourses: Joi.any(),
      auth0Id: Joi.string()
    }
  },
  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      email: Joi.string().required(),
      gradYear: Joi.number(),
      majors: Joi.any(),
      minors: Joi.any(),
      coursesTaken: Joi.any(),
      currentCourses: Joi.any(),
      auth0Id: Joi.string()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  }
};