import UserModel from "../models/user.model.js";

export function isUserNameAvailable(username) {
  userNameObject = UserModel.findOne({userName: username});

  if ((userNameObject = username)) {
    return false;
  } else if ((userNameObject = "")) {
    return false;
  } else {
    return true;
  }
}

export function isEmailAvailable(emailaddress) {
  emailObject = UserModel.findOne({email: emailaddress});

  if ((emailObject = emailaddress)) {
    return false;
  } else if ((emailObject = "")) {
    return false;
  } else {
    return true;
  }
}
