const IdNotFound = require("./IdNotFound");
const EmailAlreadyRegistered = require("./EmailAlreadyRegistered");
const WrongPassword = require("./WrongPassword");
const EmailNotFound = require("./EmailNotFound");
const UniqueColumnAlreadyExisted = require("./UniqueColumnAlreadyExisted");
const NoTokenProvided = require("./NoTokenProvided");
const InvalidToken = require("./InvalidToken");

module.exports = {
  IdNotFound,
  EmailAlreadyRegistered,
  WrongPassword,
  EmailNotFound,
  UniqueColumnAlreadyExisted,
  NoTokenProvided,
  InvalidToken,
};
