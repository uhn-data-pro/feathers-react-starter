const {
  AuthenticationService,
  JWTStrategy,
} = require("@feathersjs/authentication");
const { LocalStrategy } = require("@feathersjs/authentication-local");
const { expressOauth } = require("@feathersjs/authentication-oauth");
const { NotAuthenticated } = require("@feathersjs/errors");
const { authenticator } = require("otplib");

module.exports = (app) => {
  const authentication = new AuthenticationService(app);

  class AuthenticatorStrategy extends LocalStrategy {
    async authenticate(authentication, params) {
      //const { entity } = this.configuration;
      const { email, password, otp } = authentication;

      const result = await this.findEntity(email, params);
      // verify password, throws error or returns entity
      const user = await this.comparePassword(result, password);

      // if user does not have 2FA enabled then authenticate them
      if (!user.twoFa) {
        return {
          authentication: { strategy: this.name },
          user: await this.getEntity(result, params),
        };
      }

      // if otp is not sent along with the request and 2FA is enabled prompt for otp
      if (!otp) {
        throw new NotAuthenticated("Prompt for OTP");
      } else {
        const isValid = authenticator.check(otp, user.secretKey);
        if (!isValid) throw new NotAuthenticated("Incorrect OTP");
        return {
          authentication: { strategy: this.name },
          user: await this.getEntity(result, params),
        };
      }
    }
  }

  authentication.register("jwt", new JWTStrategy());
  authentication.register("mfa", new AuthenticatorStrategy());
  authentication.register("local", new LocalStrategy());

  app.use("/authentication", authentication);
  app.configure(expressOauth());
};
