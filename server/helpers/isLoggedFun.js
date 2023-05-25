const User = require("../models/User");

const isLoggedFun = (req, jwt) => {
  const token = req?.cookies?.token;
  let isLogged = false;
  let username = "";
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (!err) {
      // console.log(userId);
      const { userId } = decoded;
      const foundedUser = await User.findOne({ _id: userId }).exec();
      username = foundedUser.username;
      // console.log(foundedUser);
      isLogged = true;
    } else {
      isLogged = false;
    }
  });
  return { isLogged, username };
};

module.exports = { isLoggedFun };
