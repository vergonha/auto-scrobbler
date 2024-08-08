import MobileAuthorization from "../authorization";

export default async function generateSessionKey() {
  if (!(process.env.USER_NAME && process.env.PASSWD)) {
    console.error("Missing environment variables.");
    process.exit();
  }

  const authProvider = new MobileAuthorization(
    process.env.USER_NAME,
    process.env.PASSWD
  );
  const sessionKey = await authProvider.authorize();
  return sessionKey;
}
