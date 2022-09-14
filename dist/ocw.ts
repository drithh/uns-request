import request from 'superagent';

interface Profile {
  email: string;
  password: string;
  longitude?: string;
  latitude?: string;
}

export class OCW {
  constructor(
    private agent: request.SuperAgentStatic & request.Request,
    private profile: Profile
  ) {}

  private samlResponse: string;

  private async login() {
    const loginPage = await this.agent.get('https://ocw.uns.ac.id/saml/login');
    // console.log(loginPage.text);

    const regexAuthState = new RegExp(
      '<input type="hidden" name="AuthState" value="(.*?)"'
    );
    const authState = regexAuthState.exec(loginPage.text)[1];

    // console.log(authState);

    const login = await this.agent
      .post('https://sso.uns.ac.id/module.php/core/loginuserpass.php?')
      .type('form')
      .send({ AuthState: authState })
      .send({ username: this.profile.email })
      .send({ password: this.profile.password });

    // console.log(login.header['set-cookie']);

    const regexSamlResponse = new RegExp(
      '<input type="hidden" name="SAMLResponse" value="(.*?)"'
    );
    this.samlResponse = regexSamlResponse.exec(login.text)[1];

    console.log(this.samlResponse);
  }

  private async checkLogin(): Promise<boolean> {
    if (this.samlResponse) {
      const samlAuth = await this.agent
        .post('https://ocw.uns.ac.id/saml/acs')
        .type('form')
        .send({
          SAMLResponse: this.samlResponse,
        });
      const regex = new RegExp('<span class="link-label">Logout</span>');
      return regex.test(samlAuth.text);
    }
    return false;
  }

  private async auth() {
    while ((await this.checkLogin()) === false) {
      await this.login();
      console.log('Mencoba Login');
    }
    console.log('Login Success');

    //   console.log(samlAuth.text);
  }

  async absen() {
    await this.auth();
    const checkAbsen = await this.checkAbsen();
    if (typeof checkAbsen === 'string') {
      console.log('Mencoba Absen');
      await this.createAbsen(checkAbsen);
    }
    console.log('Job Berhasil');
  }

  private async checkAbsen(): Promise<boolean | string> {
    const kuliahBerlangsung = await this.agent.get(
      'https://ocw.uns.ac.id/presensi-online-mahasiswa/kuliah-berlangsung'
    );

    const regexKuliahBerlangsung = new RegExp(
      'href="/presensi-online-mahasiswa/view?(.*)">Anda Belum Presensi'
    );
    // console.log(absen.text);
    if (regexKuliahBerlangsung.test(kuliahBerlangsung.text)) {
      const link = regexKuliahBerlangsung
        .exec(kuliahBerlangsung.text)[1]
        .replaceAll('&amp;', '&');

      console.log('Absen Tersedia');
      return link;
    } else {
      console.log('Absen Tidak Tersedia');
      return false;
    }
  }

  private async createAbsen(link: string): Promise<boolean> {
    const absenPanel = await this.agent.get(
      'https://ocw.uns.ac.id/presensi-online-mahasiswa/view' + link
    );
    console.log(absenPanel.text);

    const regexAbsenPanel = new RegExp(
      '<p>Kehadiran Anda: ALPHA</p>\n.*<a class="btn btn-default" href="(.*)">Presensi Disini</a>'
    );
    if (regexAbsenPanel.test(absenPanel.text)) {
      const presensiPage = await this.agent.get(
        'https://ocw.uns.ac.id/' + regexAbsenPanel.exec(absenPanel.text)[1]
      );
      // console.log(presensiPage.text);
      const regexIdPresensi = new RegExp('let idMstPresensi = "(.*)"');

      if (regexIdPresensi.test(presensiPage.text)) {
        const idPresensi = regexIdPresensi.exec(presensiPage.text)[1];
        const absen = await this.agent
          .post(
            `https://siakad.uns.ac.id/services/v1/presensi/update-presensi-mhs-daring?id=${idPresensi}`
          )
          .type('form')
          .send({
            nim: 'M0520008',
            latitude: this.profile?.latitude
              ? this.profile.latitude
              : '-6.2087634',
            longitude: this.profile?.longitude
              ? this.profile.longitude
              : '106.845599',
            KESEHATAN: 'SEHAT',
            nimLogin: 'M0520008',
          });
        console.log(absen.text);
      }
    }
    return false;
  }
}
