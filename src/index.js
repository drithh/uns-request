"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const superagent_1 = __importDefault(require("superagent"));
const dotenv = __importStar(require("dotenv"));
const ocw_1 = require("./ocw");
const config_1 = require("./config");
const { Application, Router } = require('@cfworker/web');
const createTelegrafMiddleware = require('cfworker-middleware-telegraf');
dotenv.config();
const { secretPath, apiToken, userEmail, userPassword, longitude, latitude, ownerUsername, } = (0, config_1.getConfig)();
const bot = new telegraf_1.Telegraf(apiToken);
const agent = superagent_1.default.agent();
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
            ctx.reply(`Your Profile:\nEmail: ${userEmail}\nPassword: ${userPassword}`);
            break;
        case '/lokasi':
            ctx.reply(`Your Configured Location:\nLongitude: ${longitude}\nLatitude: ${latitude}`);
            ctx.sendLocation(parseFloat(latitude), parseFloat(longitude));
            break;
    }
});
const absen = (bot, chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = {
        email: userEmail,
        password: userPassword,
        longitude: longitude,
        latitude: latitude,
    };
    const ocw = new ocw_1.OCW(bot, chatId, agent, profile);
    yield ocw.absen();
});
const router = new Router();
router.post(`/${secretPath}`, createTelegrafMiddleware(bot));
new Application().use(router.middleware).listen();
//# sourceMappingURL=index.js.map