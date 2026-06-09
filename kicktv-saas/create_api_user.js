const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');

const supabase = createClient(
  'https://ooaimnwlpexkvokgwuzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vYWltbndscGV4a3Zva2d3dXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MzQwMTgsImV4cCI6MjA5NjUxMDAxOH0.Yb89xTjOc9jfKEr3urCLubcQaRORlc4AmpV0XlQkp7c'
);

async function run() {
  console.log("1. Signing up user via Supabase Auth API...");
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@kicktv.com', // Let's use a fresh email to ensure no conflicts
    password: 'David9560_',
  });

  if (error) {
    console.log("Signup error (might already exist):", error.message);
  } else {
    console.log("Signup successful!", data.user?.id);
  }

  console.log("2. Verifying email and setting Admin role via SQL...");
  const pgClient = new Client({
    connectionString: 'postgresql://postgres.ooaimnwlpexkvokgwuzu:Mktfunil8563*@aws-1-us-west-2.pooler.supabase.com:6543/postgres'
  });

  try {
    await pgClient.connect();

    // Fix the old user just in case, but let's confirm the new one
    await pgClient.query(`UPDATE auth.users SET email_confirmed_at = now() WHERE email IN ('iptvkick@gmail.com', 'admin@kicktv.com')`);
    
    // Set both to admin
    await pgClient.query(`UPDATE public.profiles SET role = 'admin' WHERE email IN ('iptvkick@gmail.com', 'admin@kicktv.com')`);
    
    console.log("3. Done! Emails confirmed and profiles set to admin.");
  } catch (err) {
    console.error("PG Error:", err);
  } finally {
    await pgClient.end();
  }
}

run();
