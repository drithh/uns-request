"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const getConfig = () => {
    return {
        secretPath: global.SECRET_PATH || process.env.SECRET_PATH,
        apiToken: global.BOT_TOKEN || process.env.BOT_TOKEN,
        userEmail: global.USER_EMAIL || process.env.USER_EMAIL,
        userPassword: global.USER_PASSWORD || process.env.USER_PASSWORD,
        latitude: global.LATITUDE || process.env.LATITUDE || '-7.5589378164975916',
        longitude: global.LONGITUDE ||
            process.env.LONGITUDE ||
            '110.85648055118536',
        ownerUsername: global.TELEGRAM_USERNAME || process.env.TELEGRAM_USERNAME,
    };
};
exports.getConfig = getConfig;
//# sourceMappingURL=config.js.map