// Bridge file to allow Knex CLI to load TypeScript config and migrations
require('dotenv').config(); // Load environment variables first
require('ts-node').register({ transpileOnly: true });
const tsConfig = require('./knexfile.ts');
module.exports = tsConfig.default || tsConfig;
