const {isUserNameAvailable} = require("./utils/registerModulefortesting.js");

// function isUserNameAvailable(username) {
//   userNameObject = UserModel.findOne({userName: username});

//   if ((userNameObject = username)) {
//     return false;
//   } else if ((userNameObject = "")) {
//     return false;
//   } else {
//     return true;
//   }
// }

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
