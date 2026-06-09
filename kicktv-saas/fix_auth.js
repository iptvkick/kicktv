const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres.ooaimnwlpexkvokgwuzu:Mktfunil8563*@aws-1-us-west-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();

    const userRes = await client.query(`SELECT id FROM auth.users WHERE email = 'iptvkick@gmail.com'`);
    if (userRes.rows.length === 0) {
      console.log("User not found!");
      return;
    }
    const userId = userRes.rows[0].id;

    const identityRes = await client.query(`SELECT * FROM auth.identities WHERE user_id = $1`, [userId]);
    if (identityRes.rows.length === 0) {
      console.log("Identity missing! Inserting identity...");
      await client.query(`
        INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
        VALUES ($1::uuid, $1::uuid, jsonb_build_object('sub', $1::text, 'email', 'iptvkick@gmail.com'), 'email', 'iptvkick@gmail.com', now(), now(), now())
      `, [userId]);
      console.log("Identity created.");
    } else {
      console.log("Identity exists:", identityRes.rows[0]);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
