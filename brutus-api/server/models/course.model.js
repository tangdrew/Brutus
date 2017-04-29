import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Joi from 'joi';

const InstructorSchema = new mongoose.Schema({
    name: {
        type: String
    },
    bio: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    office_hours: {
        type: String
    }
});

const RoomSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    building_id: {
        type: Number
    },
    building_name: {
        type: String
    },
    name: {
        type: String
    }
});

const course_descriptionschema = new mongoose.Schema({
    name: {
        type: String
    },
    desc: {
        type: String
    }
});

const course_componentschema = new mongoose.Schema({
    component: {
        type: String
    },
    meeting_days: {
        type: String
    },
    start_time: {
        type: String
    },
    end_time: {
        type: String
    },
    section: {
        type: String
    },
    room: {
        type: String
    }
})

const CourseSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String
    },
    term: {
        type: String
    },
    school: {
        type: String
    },
    instructor: {
        type: InstructorSchema
    },
    subject: {
        type: String
    },
    catalog_num: {
        type: String
    },
    section: {
        type: String
    },
    room: {
        type: RoomSchema
    },
    meeting_days: {
        type: String
    },
    start_time: {
        type: String
    },
    end_time: {
        type: String
    },
    start_date: {
        type: String
    },
    end_date: {
        type: String
    },
    seats: {
        type: Number
    },
    overview: {
        type: String
    },
    topic: {
        type: String
    },
    attributes: {
        type: String
    },
    requirements: {
        type: String
    },
    component: {
        type: String
    },
    class_num: {
        type: Number
    },
    course_id: {
        type: Number
    },
    course_descriptions: {
        type: [course_descriptionschema]
    },
    course_components: {
        type: [course_componentschema]
    },
    score: {
        type: Number
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
CourseSchema.method({
});

/**
 * Adding text search index
 */
CourseSchema.index({
    subject: 'text',
    catalog_num: 'text',
    title: 'text',
    overview: 'text'
}, {
  weights: {
    subject: 10,
    catalog_num: 10,
    title: 10,
    overview: 1
  }
});

/**
 * Statics
 */
CourseSchema.statics = {
  /**
   * Get course
   * @param {ObjectId} id - The API id of the course
   * @returns {Promise<Course, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((course) => {
        if (course) {
          return course;
        }
        const err = new APIError('No such Course exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List Courses in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of courses to be skipped.
   * @param {number} limit - Limit number of courses to be returned.
   * @param {string} subject - Course subject
   * @returns {Promise<Course[]>}
   */
  list({ skip, limit, subject, term} = {}) {
      console.log('==========LIST========');
      console.log({ skip, limit, subject, term});
      if(subject == 'ANY') {
        return this.find()
          .where({ term: term })
          .sort({ subject: 1, catalog_num: 1 })
          .skip(skip)
          .limit(limit)
          .exec();
      }
      else {
        return this.find()
          .where({ subject: subject, term: term })
          .sort({ subject: 1, catalog_num: 1 })
          .skip(skip)
          .limit(limit)
          .exec();
      }
    }
};

/**
 * @typedef Course
 */
export default mongoose.model('Course', CourseSchema);

/**
 * Course route validation
 */
export const CourseValidation = {
  // POST /api/Courses
  createCourse: {
    body: {
        id: Joi.number().required(),
        title: Joi.string().allow(null),
        term: Joi.string().allow(null),
        school: Joi.string().allow(null),
        instructor: Joi.any().allow(null),
        subject: Joi.string().allow(null),
        catalog_num: Joi.string().allow(null),
        section: Joi.string().allow(null),
        room: Joi.any().allow(null),
        meeting_days: Joi.string().allow(null),
        start_time: Joi.string().allow(null),
        end_time: Joi.string().allow(null),
        start_date: Joi.string().allow(null),
        end_date: Joi.string().allow(null),
        seats: Joi.number().allow(null),
        overview: Joi.string().allow(null),
        topic: Joi.string().allow(null),
        attributes: Joi.string().allow(null),
        requirements: Joi.string().allow(null),
        component: Joi.string().allow(null),
        class_num: Joi.number().allow(null),
        course_id: Joi.number().allow(null),
        course_descriptions: Joi.any().allow(null),
        course_components: Joi.any().allow(null)
    }
  },
  // UPDATE /api/courses/:course_id
  updateCourse: {
    body: {
      id: Joi.number().required(),
        title: Joi.string().allow(null),
        term: Joi.string().allow(null),
        school: Joi.string().allow(null),
        instructor: Joi.any().allow(null),
        subject: Joi.string().allow(null),
        catalog_num: Joi.string().allow(null),
        section: Joi.string().allow(null),
        room: Joi.any().allow(null),
        meeting_days: Joi.string().allow(null),
        start_time: Joi.string().allow(null),
        end_time: Joi.string().allow(null),
        start_date: Joi.string().allow(null),
        end_date: Joi.string().allow(null),
        seats: Joi.number().allow(null),
        overview: Joi.string().allow(null),
        topic: Joi.string().allow(null),
        attributes: Joi.string().allow(null),
        requirements: Joi.string().allow(null),
        component: Joi.string().allow(null),
        class_num: Joi.number().allow(null),
        course_id: Joi.number().allow(null),
        course_descriptions: Joi.any().allow(null),
        course_components: Joi.any().allow(null)
    },
    params: {
      course_id: Joi.string().hex().required()
    }
  }
};
