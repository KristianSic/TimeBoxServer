import passport from 'passport'
import { Strategy } from 'passport-jwt'
import { ExtractJwt } from 'passport-jwt'

export function setupJWTstrategy () {
  passport.use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'time:box'
      },
      (jwtPayload, done) => {
        const { username, id } = jwtPayload
        done(null, {
          username,
          id
        })
      }
    )
  )
}
