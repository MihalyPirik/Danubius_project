import passport from 'passport';
import Strategy from 'passport-discord';
import DiscordModel from '../models/DiscordModel.js';

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await DiscordModel.findById(id);
    return findUser ? done(null, findUser) : done(null, null);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: '1237794120135741491',
      clientSecret: 'FtfxxD2VDO53Nj20uxPPjUsrCshg8kyH',
      callbackURL: 'http://localhost:3000/api/auth/discord/redirect',
      scope: ['identify'],
    },
    async (accessToken, refreshToken, profile, done) => {
      let findUser
      try {
        findUser = await DiscordModel.findOne({
          discordId: profile.id,
        });
      } catch (error) {
        return done(error, null);
      }

      try {
        if (!findUser) {
          const newUser = await DiscordModel.create({
            username: profile.username,
            discordId: profile.id,
          });
          const newSaveUser = await newUser.save();
          return done(null, newSaveUser);
        }
        return done(null, findUser);
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
)