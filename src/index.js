"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const { Application, Router } = require('@cfworker/web');
const createTelegrafMiddleware = require('cfworker-middleware-telegraf');
const apiToken = global.BOT_TOKEN;
const secretPath = global.SECRET_PATH;
const userEmail = global.USER_EMAIL;
const userPassword = global.USER_PASSWORD;
const bot = new telegraf_1.Telegraf(apiToken);
bot.on('message', (ctx) => {
    ctx.reply('Hello Gais');
});
const router = new Router();
router.post(`/${secretPath}`, createTelegrafMiddleware(bot));
new Application().use(router.middleware).listen();
//# sourceMappingURL=index.js.map