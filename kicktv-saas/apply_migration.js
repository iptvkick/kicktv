const { Client } = require('pg');
const fs = require('fs');

const connectionString = "postgresql://postgres:Mktfunil8563*@db.ooaimnwlpexkvokgwuzu.supabase.co:5432/postgres";

async function run() {
  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    const sql = fs.readFileSync('supabase/migrations/20260609000000_create_servers_table.sql', 'utf8');
    await client.query(sql);
    console.log("Migration applied successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.end();
  }
}

run();
