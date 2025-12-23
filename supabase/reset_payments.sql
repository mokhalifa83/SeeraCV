-- DANGER: This will delete existing payment records to fix the schema mismatch
DROP TABLE IF EXISTS public.payments;

-- Create the payments table with ALL required columns from the start
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'sar',
  status TEXT DEFAULT 'pending',
  plan_type TEXT DEFAULT 'basic',
  downloads_used INTEGER DEFAULT 0,
  ai_requests_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view own payments" 
  ON public.payments FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all payments" 
  ON public.payments FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Reload configuration to force API to see the changes
NOTIFY pgrst, 'reload config';
