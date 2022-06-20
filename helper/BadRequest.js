class BadRequest {
    details() {
      return {
        code: "E-004",
        message: "Permintaan ke server tidak valid atau dalam masalah",
      };
    }
  }
  
  module.exports = BadRequest;
  