class UniqueColumnAlreadyExisted {
  constructor(columnName) {
    this.columnName = columnName;
  }
  details() {
    return {
      code: "E-013",
      message: `${this.columnName} already exists`,
    };
  }
}

module.exports = UniqueColumnAlreadyExisted;
