const IdNotFound = require("./IdNotFound");
const NullBody = require("./NullBody");
const InvalidEmail = require("./InvalidEmail");
const EmailAlreadyRegistered = require("./EmailAlreadyRegistered");
const WrongPassword = require("./WrongPassword");
const EmailNotFound = require("./EmailNotFound");
const UniqueColumnAlreadyExisted = require("./UniqueColumnAlreadyExisted");

module.exports = {
  IdNotFound,
  NullBody,
  InvalidEmail,
  EmailAlreadyRegistered,
  WrongPassword,
  EmailNotFound,
  UniqueColumnAlreadyExisted,
};
