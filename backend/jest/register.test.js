/**
 * CAP805 – IP 3 - Software Testing
 *
 *      I declare that this assignment is my own work in accordance with
 *      Seneca Academic Policy. No part of this assignment has been copied
 *      manually or electronically from any other source (including web sites)
 *      or distributed to other students.
 *
 *      Name: Divine Dagadu
 *      Student ID: 120657226
 *      Date: July 16th, 2023
 *
 */
const { validatePassword, validateOTP } = require("../utils/register");

describe("test user password", () => {
  test("password length", () => {
    expect(() => validatePassword("123456")).toThrow("password is too short");
  });

  test("test uppercase in password", () => {
    expect(() => validatePassword("jfjafkafhjkarr")).toThrow(
      "password must contain at least one uppercase"
    );
  });

  test("test digits in password", () => {
    expect(() => validatePassword("Afjafkafhjkarr")).toThrow(
      "password should contain at least one digit"
    );
  });

  test("test digits in password", () => {
    expect(() => validatePassword("Afjafk3fhjkarr")).toThrow(
      "password should contain ata least one special character"
    );
  });

  test("test correct password", () => {
    expect(() => validatePassword("Afjafk3f$jkarr")).toBeTruthy();
  });
});

describe("test user email", () => {
  test("otp length", () => {
    expect(() => validateOTP("123456")).toThrow("Invalid OTP");
  });

  test("otp should be numbers only", () => {
    expect(() => validateOTP("qwes44")).toThrow("Invalid OTP");
  });

  test("otp should be numbers only", () => {
    expect(() => validateOTP("qwes441223")).toThrow("Invalid OTP");
  });

  test("otp should be numbers only", () => {
    expect(() => validateOTP("441223")).toBeTruthy();
  });
});
