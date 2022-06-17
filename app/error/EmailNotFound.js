class EmailNotFound {
  constructor(email) {
    this.email = email;
  }
  details() {
    return {
      code: "006",
      message: `Email ${this.email} tidak terdaftar`,
    };
  }
}

module.exports = EmailNotFound;
