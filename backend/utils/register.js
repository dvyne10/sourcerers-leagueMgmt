export function validateOTP(otpValue) {
  const otp = otpValue.trim().substring(0,6);
  if (otp.length < 6) {
    throw new Error("Invalid OTP");
  }
  if (!/^\d+$/.test(otp)) {
    throw new Error("Invalid OTP");
  }

  return true;
}

export function validatePassword(password) {
  password.trim();
  if (password.length <= 8) {
    throw new Error("password is too short");
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error("password must contain at least one uppercase");
  }
  if (!/[0-9]/.test(password)) {
    throw new Error("password should contain at least one digit");
  }
  if (!/[!@#$%^&*?_~()-]/.test(password)) {
    throw new Error("password should contain ata least one special character");
  }
  return true;
}
