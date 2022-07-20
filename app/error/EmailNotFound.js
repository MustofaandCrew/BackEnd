class EmailNotFound {
  constructor(email) {
    this.email = email;
  }
  details() {
    return {
      code: "E-009",
      message: `Wrong Email/Password`,
    };
  }
}

module.exports = EmailNotFound;
