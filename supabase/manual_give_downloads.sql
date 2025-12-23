-- HOW TO GIVE MORE DOWNLOADS MANUALLY
-- The system calculates remaining downloads as: [Plan Limit] - [Downloads Used]
-- Plan Limit is usually 5 (Professional) or 3 (Basic).
-- To give more downloads, you simply LOWER the 'downloads_used' number.

-- OPTION 1: Reset to full limit (e.g. they have 5 fresh downloads)
UPDATE public.payments 
SET downloads_used = 0 
WHERE user_id = 'USER_ID_GOES_HERE' 
AND status = 'active';  -- Make sure to target their active plan

-- OPTION 2: Give EXTRA downloads (e.g. they want 10 total downloads)
-- If the limit is 5, setting used to -5 means: 5 - (-5) = 10 downloads available.
UPDATE public.payments 
SET downloads_used = -5 
WHERE user_id = 'USER_ID_GOES_HERE' 
AND status = 'active';

-- OPTION 3: Just add 1 extra download (subtract 1 from used)
UPDATE public.payments 
SET downloads_used = downloads_used - 1
WHERE user_id = 'USER_ID_GOES_HERE' 
AND status = 'active';
