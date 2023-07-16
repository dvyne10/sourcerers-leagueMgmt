const {isEmailAvailable} = require("./utils/registerModulefortesting");

// function isEmailAvailable(emailaddress) {
//   emailObject = UserModel.findOne({email: emailaddress});

//   if ((emailObject = emailaddress)) {
//     return false;
//   } else if ((emailObject = "")) {
//     return false;
//   } else {
//     return true;
//   }
// }

describe("email", function () {
  test("EmailAvailable function is a function", function () {
    expect(typeof isEmailAvailable).toBe("function");
  });

  test("empty/blank email returns false", function () {
    expect(isEmailAvailable("")).toBe(false);
  });

  test("existing email returns false", function () {
    expect(isEmailAvailable("eros.non@google.ca")).toBe(false);
  });

  test("new email returns false", function () {
    expect(isEmailAvailable("janicelee0908@gmail.com")).toBe(true);
  });
});
