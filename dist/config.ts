export const getConfig = () => {
  return {
    // secret path to call the bot, not really important just to reduce spam request
    secretPath: (global as any).SECRET_PATH || process.env.SECRET_PATH,
    // telegram bot token from @BotFather
    apiToken: (global as any).BOT_TOKEN || process.env.BOT_TOKEN,

    // email and password for auth to ocw.uns.ac.id
    userEmail: (global as any).USER_EMAIL || process.env.USER_EMAIL,
    userPassword: (global as any).USER_PASSWORD || process.env.USER_PASSWORD,

    // absen location
    latitude:
      (global as any).LATITUDE || process.env.LATITUDE || '-7.5589378164975916',
    longitude:
      (global as any).LONGITUDE ||
      process.env.LONGITUDE ||
      '110.85648055118536',

    // telegram username
    ownerUsername:
      (global as any).TELEGRAM_USERNAME || process.env.TELEGRAM_USERNAME,
  };
};
