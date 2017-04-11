import Term from '../models/term.model';

/**
 * Load term and append to req.
 */
function load(req, res, next, id) {
  Term.get(id)
    .then((term) => {
      req.term = term; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get term
 * @returns {Term}
 */
function get(req, res) {
  return res.json(req.term);
}

/**
 * Create new term
 * @returns {Term}
 */
function create(req, res, next) {
  const term = new Term({
      _id: req.body.id,
      name: req.body.name,
      id: req.body.id,
      subjects: req.body.subjects,
      startDate: req.body.subjects
  });

  term.save()
    .then(savedTerm => res.json(savedTerm))
    .catch(e => next(e));
}

/**
 * Update existing term
 * @property {string} req.body.termname - The termname of term.
 * @property {string} req.body.mobileNumber - The mobileNumber of term.
 * @returns {Term}
 */
function update(req, res, next) {
  const term = req.term;
  term._id = req.body.id;
  term.name = req.body.name;
  term.id = req.body.id;
  term.subjects = req.body.subjects;
  term.startDate = req.body.subjects;

  term.save()
    .then(savedTerm => res.json(savedTerm))
    .catch(e => next(e));
}

/**
 * Get term list.
 * @returns {Term[]}
 */
function list(req, res, next) {
  Term.list()
    .then(terms => res.json(terms))
    .catch(e => next(e));
}

/**
 * Delete term.
 * @returns {Term}
 */
function remove(req, res, next) {
  const term = req.term;
  term.remove()
    .then(deletedTerm => res.json(deletedTerm))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
