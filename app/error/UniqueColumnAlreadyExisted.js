class UniqueColumnAlreadyExisted {
  constructor(columnName) {
    this.columnName = columnName;
  }
  details() {
    return {
      code: "007",
      message: `${this.columnName} already exists`,
    };
  }
}

module.exports = UniqueColumnAlreadyExisted;
