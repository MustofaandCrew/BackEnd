class EmailNotFound {
  constructor(email) {
    this.email = email;
  }
  details() {
    return {
      code: "E-009",
      message: `Email ${this.email} not found`,
    };
  }
}

module.exports = EmailNotFound;
