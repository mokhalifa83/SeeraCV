-- DATABASE HEALTH CHECK SCRIPT
-- Run this in the Supabase SQL Editor to see everything at once.

-- 1. Check if users exist in Profiles (Limit 5)
SELECT 'PROFILES TABLE CHECK' as check_name, id, full_name, email, created_at FROM profiles ORDER BY created_at DESC LIMIT 5;

-- 2. Check if users have Payments/Credits (Limit 5)
SELECT 'PAYMENTS TABLE CHECK' as check_name, user_id, plan_type, downloads_used, expires_at FROM payments ORDER BY created_at DESC LIMIT 5;

-- 3. Check if users have CVs saved (Limit 5)
SELECT 'CVS TABLE CHECK' as check_name, user_id, title, created_at FROM cvs ORDER BY created_at DESC LIMIT 5;

-- If you see data in all 3 checks, your database is working perfectly.
-- Remember: 'downloads_used' is ONLY in the PAYMENTS table.
