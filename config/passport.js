const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const passport = require("passport");
const { User } = require("../models/");

const options = {
	secretOrKey: process.env.JWT_SECRET_KEY,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

//returns 'unauthorized when failed
//payload === token
//done === callback (executed when verification suceeds)
const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
	console.log(payload);

	try {
		const user = await User.findOne({ where: { id: payload.id } });
		if (!user) {
			return done(null, false);
		}
		done(null, { ...payload, message: "successful token verification" });
	} catch (err) {
		done(err, false);
	}
});

passport.use("jwt", jwtStrategy);
