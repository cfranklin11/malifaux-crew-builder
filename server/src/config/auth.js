import fs from 'fs';
let env = {};
let envFile = `${__dirname}/../../src/config/env.json`;

if (fs.existsSync(envFile)) {
  env = fs.readFileSync(envFile, 'utf-8');
  env = JSON.parse(env);
  Object.keys(env).forEach(key => {
    process.env[key] = env[key];
  });
}

export default {
  client_email: process.env.client_email,
  private_key: process.env.private_key.replace(/_/g, ' '),
  docID: process.env.doc_id
};
