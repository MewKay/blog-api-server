const prisma = require("../config/prisma-client");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  const { username, password } = req.body.user;

  const newUser = await prisma.user.create({
    data: {
      username,
      password: await bcrypt.hash(password, 10),
    },
  });
  delete newUser.password;

  res.json(newUser);
};

module.exports = { createUser };
