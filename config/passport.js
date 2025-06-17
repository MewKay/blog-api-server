const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

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

    delete user.password;
    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

const localStrategy = new LocalStrategy(verifyLocal);
passport.use(localStrategy);

// Setup JWT Strategy
const strategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const verifyJWT = async (jwtPayload, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: jwtPayload.id,
      },
    });

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

const jwtStrategy = new JwtStrategy(strategyOptions, verifyJWT);
passport.use(jwtStrategy);
