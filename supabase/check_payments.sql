-- Check all payments/subscriptions
SELECT 
  id,
  user_id,
  plan_type,
  stripe_session_id,
  amount,
  currency,
  downloads_used,
  ai_requests_used,
  expires_at,
  created_at,
  updated_at
FROM payments
ORDER BY created_at DESC
LIMIT 20;

-- Check summary statistics
SELECT 
  plan_type,
  COUNT(*) as total_subscriptions,
  SUM(downloads_used) as total_downloads,
  SUM(ai_requests_used) as total_ai_requests,
  COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active_subscriptions,
  COUNT(CASE WHEN expires_at <= NOW() THEN 1 END) as expired_subscriptions
FROM payments
GROUP BY plan_type;
