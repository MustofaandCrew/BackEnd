class DeleteSuccess {
    constructor(id) {
        this.id = id;
      }

    details() {
      return {
        code: "S-003",
        message: `Id ${this.id} success deleted`,
      };
    }
  }
  
  module.exports = DeleteSuccess;