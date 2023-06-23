/**
 * create user
 * login user
 * authenticate user
 * logout user 
 * delete user
 */

const authUser = (req, res) => {
  res.status(200).json({
    message: "Auth user",
  });
};

const login = (req, res) => {
  res.status(200).json({
    message: "login user",
  });
};

export { authUser, login };
