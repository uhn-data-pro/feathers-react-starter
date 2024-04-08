const { authenticate } = require("@feathersjs/authentication").hooks;
const { iff, isProvider } = require("feathers-hooks-common");
const omit = require("lodash/omit");
const { hashPassword, protect } =
  require("@feathersjs/authentication-local").hooks;

const { authenticator } = require("otplib");
const QRCode = require("qrcode");

const generateSecret = () => (context) => {
  // if patch request was to enable twoFa
  if ("twoFa" in context.data) {
    const secret = authenticator.generateSecret();
    context.data.secretKey = secret;
  }
  return context;
};

const createQR = () => (context) => {
  if ("twoFa" in context.data) {
    const { email, secretKey } = context.data;
    const otpauth = authenticator.keyuri(email, "users", secretKey);

    return QRCode.toDataURL(otpauth)
      .then((url) => {
        context.result.url = url;
        return context;
      })
      .catch((err) => {
        console.error(err);
      });
  }
  return context;
};

const hideSensitiveFields = () => (context) => {
  const sensitiveFields = ["password", "secretKey"];
  context.result = omit(context.result, sensitiveFields);
  return context;
};

module.exports = {
  before: {
    all: [],
    find: [authenticate("jwt")],
    get: [authenticate("jwt")],
    create: [hashPassword("password")],
    update: [hashPassword("password"), authenticate("jwt")],
    patch: [generateSecret(), hashPassword("password"), authenticate("jwt")],
    remove: [authenticate("jwt")],
  },

  after: {
    all: [iff(isProvider("external")), hideSensitiveFields()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [createQR()],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
