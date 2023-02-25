export const DOMAIN_URL = "http://localhost:3001/";
export const QUIZ_RESULTS_LIMIT = 5;

export const openIDOptions = {
  issuer: `${process.env.AUTH0_ISSUER_BASE_URL}/`,
  authorizationURL: `${process.env.AUTH0_ISSUER_BASE_URL}/authorize`,
  tokenURL: `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
  userInfoURL: `${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: `${process.env.AUTH0_BASE_URL}/api/auth/redirect`,
  scope: ["profile", "email"],
};
