import fs from 'fs';
let env = {};

if (!process.env.client_email || !process.env.private_key) {
  let envFile = `${__dirname}/../../src/config/env.json`;

  if (fs.existsSync(envFile)) {
    env = fs.readFileSync(envFile, 'utf-8');
    env = JSON.parse(env);
    Object.keys(env).forEach(key => {
      process.env[key] = env[key];
    });
  }
}

export default {
  clientEmail: process.env.client_email,
  privateKey: process.env.private_key.replace(/_/g, ' '),
  docID: process.env.doc_id
};
