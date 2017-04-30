import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Joi from 'joi';

const ReviewSchema = new mongoose.Schema({
  course: {
      // type: mongoose.Schema.Types.ObjectId,
      type: Number,
      ref: 'Course'
  },
  course_id: {
    type: Number
  },
  instructor: {
    type: String
  },
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  rating: {
      type: Number
  },
  grade: {
      type: Number
  },
  time: {
      type: Number
  },
  comment: {
      type: String
  },
  created_at: {
    type: Date,
    default: Date.now
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
ReviewSchema.method({});

/**
 * Statics
 */
ReviewSchema.statics = {
  /**
   * Get review
   * @param {ObjectId} id - The objectId of review.
   * @returns {Promise<Review, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((review) => {
        if (review) {
          return review;
        }
        const err = new APIError('No such review exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List reviews in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of reviews to be skipped.
   * @param {number} limit - Limit number of reviews to be returned.
   * @returns {Promise<Review[]>}
   */
  list({ skip = 0, limit = 50, course } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .where({ course: course })
      .skip(skip)
      .limit(limit)
      .exec();
  },

  getCourseScore(course, factor) {
    //match by id
    // return this.aggregate()
    //   .match({course: course._id})
    //   .group({_id: "$course", avgScore: {$avg: `$${factor}`}})
    //   .exec();
    //match by course_id and instructor
    console.log('GET COURSE SCORES');
    return this.aggregate()
      .match({course_id: course.course_id, instructor: course.instructor.name})
      .group({_id: "$course_id", avgScore: {$avg: `$${factor}`}})
      .exec();
  }
};

/**
 * @typedef Review
 */
export default mongoose.model('Review', ReviewSchema);

/**
 * Review route validation
 */
export const ReviewValidation = {
  // POST /api/reviews
  createReview: {
    body: {
      course: Joi.number().required(),
      user: Joi.string().required(),
      course_id: Joi.number(),
      instructor: Joi.string(),
      rating: Joi.number(),
      grade: Joi.number(),
      time: Joi.number(),
      comment: Joi.string()
    }
  },
  // UPDATE /api/reviews/:reviewId
  updateReview: {
    body: {
      course: Joi.number().required(),
      course_id: Joi.number(),
      instructor: Joi.string(),
      user: Joi.string().required(),
      rating: Joi.number(),
      grade: Joi.number(),
      time: Joi.number(),
      comment: Joi.string()
    },
    params: {
      reviewId: Joi.string().hex().required()
    }
  }
};
