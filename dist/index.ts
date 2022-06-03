// import superagent
import request from 'superagent';
import { OCW } from './ocw';

const profile = {
  username: 'adrielalfeus@student.uns.ac.id',
  password: '',
};

const main = async () => {
  const agent = request.agent();
  const ocw = new OCW(agent, profile);
  await ocw.absen();
};

main();
