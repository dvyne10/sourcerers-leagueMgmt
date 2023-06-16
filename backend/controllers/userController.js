const authUser = (req, res) => {
  res.status(200).json({
    message: "Auth user",
  });
};

export { authUser };
