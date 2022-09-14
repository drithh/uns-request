import { Telegraf } from 'telegraf';
import request from 'superagent';
import * as dotenv from 'dotenv';
import { OCW } from './ocw';
import { getConfig } from './config';
const { Application, Router } = require('@cfworker/web');
const createTelegrafMiddleware = require('cfworker-middleware-telegraf');

dotenv.config();

const {
  secretPath,
  apiToken,
  userEmail,
  userPassword,
  longitude,
  latitude,
  ownerUsername,
} = getConfig();

const bot = new Telegraf(apiToken);
const agent = request.agent();

bot.on('text', (ctx) => {
  if (ctx.message.from.username !== ownerUsername) {
    ctx.reply('Hello, stranger!\nSorry, I can only talk to my master.');
    return;
  }
  switch (ctx.message.text) {
    case '/absen':
      ctx.reply('Absen...');
      absen(bot, ctx.from.id);
      break;
    case '/profile':
      ctx.reply(
        `Your Profile:\nEmail: ${userEmail}\nPassword: ${userPassword}`
      );
      break;
    case '/lokasi':
      ctx.reply(
        `Your Configured Location:\nLongitude: ${longitude}\nLatitude: ${latitude}`
      );
      ctx.sendLocation(parseFloat(latitude), parseFloat(longitude));
      break;
  }
});

const absen = async (bot: Telegraf, chatId: number) => {
  const profile = {
    email: userEmail,
    password: userPassword,
    longitude: longitude,
    latitude: latitude,
  };
  const ocw = new OCW(bot, chatId, agent, profile);
  await ocw.absen();
};

// bot.launch();

const router = new Router();
router.post(`/${secretPath}`, createTelegrafMiddleware(bot));
new Application().use(router.middleware).listen();
