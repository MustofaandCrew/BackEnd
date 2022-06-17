class InvalidEmail {
  constructor(email) {
    this.email = email;
  }
  details() {
    return {
      code: "003",
      message: `Email ${this.email} tidak valid`,
    };
  }
}

module.exports = InvalidEmail;
