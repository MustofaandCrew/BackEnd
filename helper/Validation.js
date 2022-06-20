class Validation {
    constructor(errors) {
        this.errors = errors;
      }
    details() {
      return {
        code: "E-003",
        message: "Input harus lebih dari 3 huruf dan kurang dari 10 huruf",
        error: this.error,
      };
    }
  }
  
  module.exports = Validation;
  