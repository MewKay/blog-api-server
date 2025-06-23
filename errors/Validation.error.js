class Validation extends Error {
  constructor(message) {
    super(message);
    this.name = "Validation";
    this.statusCode = 400;
  }
}

module.exports = Validation;
