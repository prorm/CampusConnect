class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const badRequest = (message, details) => new HttpError(400, message, details);
const unauthorized = (message = "Please sign in to continue.") =>
  new HttpError(401, message);
const forbidden = (message = "Your role cannot do that.") =>
  new HttpError(403, message);
const notFound = (message = "Not found.") => new HttpError(404, message);
const conflict = (message) => new HttpError(409, message);

/** Trims a string field and enforces a maximum length. */
function text(value, { field, max = 200, required = true } = {}) {
  const result = typeof value === "string" ? value.trim() : "";
  if (required && !result) throw badRequest(`${field} is required.`);
  if (result.length > max)
    throw badRequest(`${field} must be ${max} characters or fewer.`);
  return result;
}

function integer(value, { field, min, max }) {
  const result = Number(value);
  if (!Number.isInteger(result) || result < min || result > max)
    throw badRequest(`${field} must be a whole number from ${min} to ${max}.`);
  return result;
}

module.exports = {
  HttpError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  text,
  integer,
};
