const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres.ooaimnwlpexkvokgwuzu:Mktfunil8563*@aws-1-us-west-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to Supabase Postgres (IPv4 Pooler)!');

    console.log('Creating Admin User...');
    // Create admin user in auth.users directly via SQL if not exists
    const adminCheck = await client.query(`SELECT id FROM auth.users WHERE email = 'iptvkick@gmail.com'`);
    let adminId;
    
    if (adminCheck.rows.length === 0) {
      const result = await client.query(`
        INSERT INTO auth.users (
          instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
          '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'iptvkick@gmail.com', crypt('David9560_', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
        ) RETURNING id;
      `);
      adminId = result.rows[0].id;
      console.log('Admin user inserted into auth.users with ID:', adminId);
    } else {
      adminId = adminCheck.rows[0].id;
      console.log('Admin user already exists in auth.users with ID:', adminId);
    }

    // Ensure the profile role is updated to 'admin'
    await client.query(`UPDATE public.profiles SET role = 'admin' WHERE id = $1`, [adminId]);
    console.log('Admin profile role updated successfully.');

    console.log('All Database tasks completed successfully!');
  } catch (err) {
    console.error('Database task failed:', err);
  } finally {
    await client.end();
  }
}

run();
