class IdNotFound {
  constructor(id) {
    this.id = id;
  }

  details() {
    return {
      code: "E-010",
      message: `Id ${this.id} not found`,
    };
  }
}

module.exports = IdNotFound;
