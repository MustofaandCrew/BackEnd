class EmailAlreadyRegistered {
  details() {
    return {
      code: "E-008",
      message: `Email already registered`,
    };
  }
}

module.exports = EmailAlreadyRegistered;
