const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const prisma = require("./prisma-client");
const bcrypt = require("bcryptjs");

// Setup Local Strategy
const verifyLocal = async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return done(null, false, { message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return done(null, false, { message: "Password is invalid" });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

const localStrategy = new LocalStrategy(verifyLocal);

passport.use(localStrategy);
