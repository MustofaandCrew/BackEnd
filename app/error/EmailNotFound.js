class EmailNotFound {
  constructor(email) {
    this.email = email;
  }
  details() {
    return {
      code: "E-009",
      message: `Email not registered`,
    };
  }
}

module.exports = EmailNotFound;
