import pg from 'pg';

const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:Mktfunil8563*@db.ooaimnwlpexkvokgwuzu.supabase.co:5432/postgres',
});

async function main() {
  try {
    await client.connect();
    console.log("Connected to Supabase DB!");

    const query = `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;`;
    
    console.log("Executing query:", query);
    const res = await client.query(query);
    console.log("Query executed successfully!");
    console.log("Rows affected:", res.rowCount, "Command:", res.command);

  } catch (error) {
    console.error("Error executing query:", error);
  } finally {
    await client.end();
    console.log("Connection closed.");
  }
}

main();
