import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Joi from 'joi';

const SubjectSchema = new mongoose.Schema({
    symbol: {
        type: String
    },
    name: {
        type: String
    }
});

const TermSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    name: {
        type: String
    },
    end_date: {
        type: String
    },
    id: {
        type: Number
    },
    subjects: {
        type: [SubjectSchema]
    },
    start_date: {
        type: String
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
TermSchema.method({
});

/**
 * Statics
 */
TermSchema.statics = {
  /**
   * Get term
   * @param {ObjectId} id - The objectId of term.
   * @returns {Promise<Term, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((term) => {
        if (term) {
          return term;
        }
        const err = new APIError('No such Term exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List Terms in descending order of id.
   * @returns {Promise<Term[]>}
   */
  list() {
    return this.find()
      .sort({ id: -1 })
      .exec();
  }
};

/**
 * @typedef Term
 */
export default mongoose.model('Term', TermSchema);

/**
 * Term route validation
 */
export const TermValidation = {
  // POST /api/Terms
  createTerm: {
    body: {
        _id: Joi.number().required(),
        name: Joi.string().allow(null),
        end_date: Joi.string().allow(null),
        id: Joi.number().allow(null),
        subjects: Joi.any().allow(null),
        start_date: Joi.string().allow(null)
    }
  },
  // UPDATE /api/terms/:termId
  updateTerm: {
    body: {
        id: Joi.number().required(),
        name: Joi.string().allow(null),
        end_date: Joi.string().allow(null),
        id: Joi.number().allow(null),
        subjects: Joi.any().allow(null),
        start_date: Joi.string().allow(null)
    },
    params: {
      termId: Joi.string().hex().required()
    }
  }
};
