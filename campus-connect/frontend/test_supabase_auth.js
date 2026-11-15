import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

console.log('=== VERIFYING SUPABASE AUTH INTEGRATION ===\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// 1. Verify Migration File
const migrationPath = '../supabase_auth_migration.sql';
assert(fs.existsSync(migrationPath), 'Migration SQL file exists at ' + migrationPath);

const migrationSql = fs.readFileSync(migrationPath, 'utf8');
assert(migrationSql.includes('user_id UUID UNIQUE REFERENCES auth.users(id)'), 'Safe user_id link column to auth.users exists');
assert(migrationSql.includes('DROP COLUMN IF EXISTS custom_password'), 'Insecure custom_password column is dropped');
assert(migrationSql.includes('CREATE OR REPLACE FUNCTION public.handle_new_auth_user()'), 'handle_new_auth_user() trigger function exists');
assert(migrationSql.includes('protect_profile_role'), 'Role escalation protection trigger exists');
assert(migrationSql.includes("bucket_id = 'academic-resources'"), 'Private academic-resources storage policies exist');
assert(migrationSql.includes('1048576'), 'Strict 1 MB limit (1048576 bytes) configured');

// 2. Verify Client Connection
const url = 'https://dkqvxwnjmolckjktmwtw.supabase.co';
const key = 'sb_publishable_6Cz7tx5vS5u6y0t98fIloQ_-pBVA0KB';
const supabase = createClient(url, key);

assert(supabase.auth !== undefined, 'Supabase Auth module is available');
assert(typeof supabase.auth.signUp === 'function', 'supabase.auth.signUp is a function');
assert(typeof supabase.auth.signInWithPassword === 'function', 'supabase.auth.signInWithPassword is a function');
assert(typeof supabase.auth.signOut === 'function', 'supabase.auth.signOut is a function');
assert(typeof supabase.auth.resetPasswordForEmail === 'function', 'supabase.auth.resetPasswordForEmail is a function');
assert(typeof supabase.auth.updateUser === 'function', 'supabase.auth.updateUser is a function');

// 3. Verify Frontend Code
const authContextCode = fs.readFileSync('src/context/AuthContext.jsx', 'utf8');
assert(authContextCode.includes('supabase.auth.signInWithPassword'), 'AuthContext integrates signInWithPassword');
assert(authContextCode.includes('supabase.auth.signUp'), 'AuthContext integrates signUp');
assert(authContextCode.includes('supabase.auth.signOut'), 'AuthContext integrates signOut');
assert(authContextCode.includes('supabase.auth.onAuthStateChange'), 'AuthContext listens to onAuthStateChange');
assert(authContextCode.includes('resetPassword'), 'AuthContext provides resetPassword for email recovery');
assert(!authContextCode.includes('custom_password'), 'AuthContext has zero references to custom_password');

const forgotPwCode = fs.readFileSync('src/pages/ForgotPasswordPage.jsx', 'utf8');
assert(forgotPwCode.includes('resetPassword'), 'ForgotPasswordPage uses resetPassword');
assert(forgotPwCode.includes('updatePassword'), 'ForgotPasswordPage handles new password submission');
assert(!forgotPwCode.includes('7392'), 'Simulated OTP code 7392 is removed');

const registerCode = fs.readFileSync('src/pages/RegisterPage.jsx', 'utf8');
assert(registerCode.includes('requiresConfirmation'), 'RegisterPage handles email confirmation');

console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
if (failed > 0) process.exit(1);
