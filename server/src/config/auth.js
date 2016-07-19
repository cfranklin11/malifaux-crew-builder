import fs from 'fs';
let env = {};

if (!process.env.client_email || !process.env.private_key) {
  let envFile = `${__dirname}/../../src/config/env.json`;

  if (fs.existsSync(envFile)) {
    env = fs.readFileSync(envFile, 'utf-8');
    env = JSON.parse(env);
    Object.keys(env).forEach((key) => {
      process.env[key] = env[key];
    });
  }
}

export default {
  client_email: process.env.client_email,
  private_key: process.env.private_key.replace(/_/g, ' '),
  secret: process.env.secret,
  doc_id: process.env.doc_id
};