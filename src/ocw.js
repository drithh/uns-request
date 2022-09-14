"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OCW = void 0;
class OCW {
    constructor(bot, chatId, agent, profile) {
        this.bot = bot;
        this.chatId = chatId;
        this.agent = agent;
        this.profile = profile;
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sendMessage('loginPage');
            const loginPage = yield this.agent.get('https://ocw.uns.ac.id/saml/login');
            this.sendMessage(loginPage.text);
            const regexAuthState = new RegExp('<input type="hidden" name="AuthState" value="(.*?)"');
            const authState = regexAuthState.exec(loginPage.text)[1];
            const login = yield this.agent
                .post('https://sso.uns.ac.id/module.php/core/loginuserpass.php?')
                .type('form')
                .send({ AuthState: authState })
                .send({ username: this.profile.email })
                .send({ password: this.profile.password });
            const regexSamlResponse = new RegExp('<input type="hidden" name="SAMLResponse" value="(.*?)"');
            this.samlResponse = regexSamlResponse.exec(login.text)[1];
        });
    }
    checkLogin() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sendMessage('Mengecek Login');
            if (this.samlResponse) {
                const samlAuth = yield this.agent
                    .post('https://ocw.uns.ac.id/saml/acs')
                    .type('form')
                    .send({
                    SAMLResponse: this.samlResponse,
                });
                const regex = new RegExp('<span class="link-label">Logout</span>');
                return regex.test(samlAuth.text);
            }
            return false;
        });
    }
    auth() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.login();
            this.sendMessage('Login Berhasil');
            this.sendMessage('Login Berhasil');
        });
    }
    sendMessage(message) {
        this.bot.telegram.sendMessage(this.chatId, message);
    }
    absen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.auth();
            this.sendMessage('Auth Berhasil');
            const checkAbsen = yield this.checkAbsen();
            if (typeof checkAbsen === 'string') {
                this.sendMessage('Mencoba Absen');
                yield this.createAbsen(checkAbsen);
            }
            this.sendMessage('Job Berhasil');
        });
    }
    checkAbsen() {
        return __awaiter(this, void 0, void 0, function* () {
            const kuliahBerlangsung = yield this.agent.get('https://ocw.uns.ac.id/presensi-online-mahasiswa/kuliah-berlangsung');
            const regexKuliahBerlangsung = new RegExp('href="/presensi-online-mahasiswa/view?(.*)">Anda Belum Presensi');
            if (regexKuliahBerlangsung.test(kuliahBerlangsung.text)) {
                const link = regexKuliahBerlangsung
                    .exec(kuliahBerlangsung.text)[1]
                    .replaceAll('&amp;', '&');
                this.sendMessage('Absen Tersedia');
                return link;
            }
            else {
                this.sendMessage('Absen Tidak Tersedia');
                return false;
            }
        });
    }
    createAbsen(link) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const absenPanel = yield this.agent.get('https://ocw.uns.ac.id/presensi-online-mahasiswa/view' + link);
            const regexAbsenPanel = new RegExp('<p>Kehadiran Anda: ALPHA</p>\n.*<a class="btn btn-default" href="(.*)">Presensi Disini</a>');
            if (regexAbsenPanel.test(absenPanel.text)) {
                const presensiPage = yield this.agent.get('https://ocw.uns.ac.id/' + regexAbsenPanel.exec(absenPanel.text)[1]);
                const regexIdPresensi = new RegExp('let idMstPresensi = "(.*)"');
                if (regexIdPresensi.test(presensiPage.text)) {
                    const idPresensi = regexIdPresensi.exec(presensiPage.text)[1];
                    const absen = yield this.agent
                        .post(`https://siakad.uns.ac.id/services/v1/presensi/update-presensi-mhs-daring?id=${idPresensi}`)
                        .type('form')
                        .send({
                        nim: 'M0520008',
                        latitude: (_a = this.profile) === null || _a === void 0 ? void 0 : _a.latitude,
                        longitude: (_b = this.profile) === null || _b === void 0 ? void 0 : _b.longitude,
                        KESEHATAN: 'SEHAT',
                        nimLogin: 'M0520008',
                    });
                    console.log(absen.text);
                }
            }
            return false;
        });
    }
}
exports.OCW = OCW;
//# sourceMappingURL=ocw.js.map