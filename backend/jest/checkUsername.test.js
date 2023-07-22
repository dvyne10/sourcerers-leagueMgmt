// Student Name   : Jinny Lee
// Student Number : 123647224
const {isUserNameAvailable} = require("../utils/registerModulefortesting.js");

describe("email", function () {
  test("UserName function is a function", function () {
    expect(typeof isUserNameAvailable).toBe("function");
  });

  test("Empty username  returns false", function () {
    expect(isUserNameAvailable("")).toBe(false);
  });

  test("Existing username returns false", function () {
    expect(isUserNameAvailable("sMcdowell")).toBe(false);
  });

  test("New username returns true", function () {
    expect(isUserNameAvailable("jLeehur")).toBe(true);
  });
});
