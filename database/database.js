const pgp = require("pg-promise")({});
const db = pgp(
  "postgres://postgres.jnvimtcxfazgaqnnagwt:1_Mochmeow!@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
);

module.exports = db;
