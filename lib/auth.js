import { KindeServer } from "@kinde-oss/kinde-auth-nextjs/server";

export const kinde = new KindeServer({
  clientId: process.env.KINDE_CLIENT_ID,
  clientSecret: process.env.KINDE_CLIENT_SECRET,
  issuer: process.env.KINDE_ISSUER_URL,
  redirectUri: process.env.KINDE_REDIRECT_URI,
  logoutRedirectUri: process.env.KINDE_LOGOUT_REDIRECT_URI,
});
