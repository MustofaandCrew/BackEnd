class EmailNotFound {
  constructor(email) {
    this.email = email;
  }
  details() {
    return {
      code: "E-009",
      message: `Email ${this.email} tidak terdaftar`,
    };
  }
}

module.exports = EmailNotFound;
