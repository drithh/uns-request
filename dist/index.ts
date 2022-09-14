import { Telegraf } from 'telegraf';
// const { Application, Router } = require('@cfworker/web');
// const createTelegrafMiddleware = require('cfworker-middleware-telegraf');
import * as dotenv from 'dotenv';
dotenv.config();
// cloudflare path
const secretPath = (global as any).SECRET_PATH || process.env.SECRET_PATH;

// telegram bot token from @BotFather
const apiToken = (global as any).BOT_TOKEN || process.env.BOT_TOKEN;

// email and password for auth to ocw.uns.ac.id
const userEmail = (global as any).USER_EMAIL || process.env.USER_EMAIL;
const userPassword = (global as any).USER_PASSWORD || process.env.USER_PASSWORD;

// telegram username
const botOwner =
  (global as any).TELEGRAM_USERNAME || process.env.TELEGRAM_USERNAME;

const bot = new Telegraf(apiToken);

bot.on('message', (ctx) => {
  console.log(ctx.message);
  if (ctx.message.from.username !== botOwner) {
    ctx.reply('Hello, stranger!\nSorry, I can only talk to my master.');
    return;
  }
});

bot.launch();
// const router = new Router();
// router.post(`/${secretPath}`, createTelegrafMiddleware(bot));
// new Application().use(router.middleware).listen();
