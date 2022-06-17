class IdNotFound {
  constructor(id) {
    this.id = id;
  }

  details() {
    return {
      code: "001",
      message: `Id ${this.id} not found`,
    };
  }
}

module.exports = IdNotFound;
