import Course from '../models/course.model';
import Review from '../models/review.model';

/**
 * Load course and append to req.
 */
function load(req, res, next, id) {
  Course.get(id)
    .then((course) => {
      req.course = course; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get course
 * @returns {Course}
 */
function get(req, res) {
  return res.json(req.course);
}

/**
 * Create new course
 * @property {string} req.body.coursename - The coursename of course.
 * @property {string} req.body.mobileNumber - The mobileNumber of course.
 * @returns {Course}
 */
function create(req, res, next) {
  const course = new Course({
    id: req.body.id,
    title: req.body.title,
    term: req.body.term,
    school: req.body.school,
    instructor: req.body.instructor,
    subject: req.body.subject,
    catalog_num: req.body.catalog_num,
    section: req.body.section,
    room: req.body.room,
    meeting_days: req.body.meeting_days,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    seats: req.body.seats,
    overview: req.body.overview,
    topic: req.body.topic,
    attributes: req.body.attributes,
    requirements: req.body.requirements,
    component: req.body.component,
    class_num: req.body.class_num,
    course_id: req.body.course_id,
    course_descriptions: req.body.course_descriptions,
    course_components: req.body.course_components
  });

  course.save()
    .then(savedCourse => res.json(savedCourse))
    .catch(e => next(e));
}

/**
 * Update existing course
 * @property {string} req.body.coursename - The coursename of course.
 * @property {string} req.body.mobileNumber - The mobileNumber of course.
 * @returns {Course}
 */
function update(req, res, next) {
  const course = req.course;
  course.id = req.body.id;
  course.title = req.body.title;
  course.term = req.body.term;
  course.school = req.body.school;
  course.instructor = req.body.instructor;
  course.subject = req.body.subject;
  course.catalog_num = req.body.catalog_num;
  course.section = req.body.section;
  course.room = req.body.room;
  course.meeting_days = req.body.meeting_days;
  course.start_time = req.body.start_time;
  course.end_time = req.body.end_time;
  course.start_date = req.body.start_date;
  course.end_date = req.body.end_date;
  course.seats = req.body.seats;
  course.overview = req.body.overview;
  course.topic = req.body.topic;
  course.attributes = req.body.attributes;
  course.requirements = req.body.requirements;
  course.component = req.body.component;
  course.class_num = req.body.class_num;
  course.course_id = req.body.course_id;
  course.course_descriptions = req.body.course_descriptions;
  course.course_components = req.body.course_components;

  course.save()
    .then(savedCourse => res.json(savedCourse))
    .catch(e => next(e));
}

/**
 * Get course list.
 * @property {number} req.query.skip - Number of courses to be skipped.
 * @property {number} req.query.limit - Limit number of courses to be returned.
 * @property {string} req.query.subject - Course subject
 * @returns {Course[]}
 */
function list(req, res, next) {
  req.query.limit = req.query.limit === undefined ? 10 : Number(req.query.limit);
  req.query.skip = req.query.skip === undefined ? 0 :  Number(req.query.skip);
  let { skip, limit, searchTerm, subject, term } = req.query;
  if(searchTerm) {
    search(skip, limit, searchTerm, subject, term).then(courses => {
      if(req.query.factor) {
        courseScores(courses, req.query.factor)
          .then((courseScores) => {
            let scoredCourses = [];
            courseScores.forEach((courseScore) => {
              let temp = courses.find(course => String(course.id) === String(courseScore.id));
              temp.score = courseScore.avgScore;
              scoredCourses.push(temp);
            });
            res.json(scoredCourses);
          });
      } else {
        res.json(courses);
      }
    })
    .catch(e => next(e));
  }
  else {
    Course.list({ skip, limit, subject, term }).then(courses => {
      if(req.query.factor) {
        courseScores(courses, req.query.factor)
          .then((courseScores) => {
            let scoredCourses = [];
            courseScores.forEach((courseScore) => {
              let temp = courses.find(course => String(course.id) === String(courseScore.id));
              temp.score = courseScore.avgScore;
              scoredCourses.push(temp);
            });
            res.json(scoredCourses);
          });
      } else {
        res.json(courses);
      }
    })
    .catch(e => next(e));

    //TODO: do something about sorting with ANY subject
    // Review.list().then(reviews => {
    //   console.log(reviews);
    //   let courses = []
    //   Promise.all(reviews.forEach(review => {
    //     Course.get(review.course)
    //     .then(course => {
    //       return course;
    //       // if(course) {
    //       //   console.log(course);
    //       //   courses.push(course);
    //       // }
    //     });
    //   })).then(values => {
    //     console.log('values', values);
    //     res.json(values);
    //   })
    //
    // });

  }
}

/**
 * Return courses that match search term
 * @param {string} searchTerm - term to match
 * @param {number} skip - number of courses to be skipped
 * @param {number} limit - limit number of courses to be returned
 * @param {string} subject - course subject
 * @param {string} term - school term
 * @returns {Promise<Course[]>}
 */
function search(skip, limit, searchTerm, subject, term) {
  // return Course.list({
  //   limit: 100000,
  //   subject: subject,
  //   term: term
  // }).then(courses => {
  //     return courses.filter(course => {
  //       let searchField = course.subject + course.catalog_num + course.title;
  //       searchField = searchField.toLowerCase().replace(/ /g,'');
  //       searchTerm = searchTerm.toLowerCase().replace(/ /g,'');
  //       return searchField.includes(searchTerm);
  //     }).slice(skip, skip + 50);
  //   });

  return Course.search({
    limit: 50,
    subject: subject,
    term: term,
    searchTerm: searchTerm
  }).then(courses => {
    return courses;
  })
}

/**
 * Ranks list of course by specific factor
 * @property {Course[]} courses - Unsorted array of course objects
 * @property {string} factor - Factor to rank by
 * @returns {Course[]}
 */
function courseScores(courses, factor) {
  return new Promise((fulfill, reject) => {
      let courseScores = []
      let requests = courses.map((course) => {
        if(course) {
          return Review.getCourseScore(course, factor.toLowerCase())
              .then((courseScore) => {
                if(courseScore.length > 0) {
                  courseScore[0].id = course.id;
                  courseScores = courseScores.concat(courseScore[0]);
                }
              });
        }
        else {
          reject('Invalid Course');
        }
      });
      Promise.all(requests).then(() => {
        console.log('done');
        fulfill(courseScores);
      });
  });
}

/**
 * Delete course.
 * @returns {Course}
 */
function remove(req, res, next) {
  const course = req.course;
  course.remove()
    .then(deletedCourse => res.json(deletedCourse))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
