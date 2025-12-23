-- Create payments table to track purchases
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'professional')),
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'SAR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view their own payments"
ON public.payments
FOR SELECT
USING (auth.uid() = user_id);

-- Service role can insert payments (from webhook)
CREATE POLICY "Service role can insert payments"
ON public.payments
FOR INSERT
WITH CHECK (true);

-- Service role can update payments (from webhook)
CREATE POLICY "Service role can update payments"
ON public.payments
FOR UPDATE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_payments_timestamp
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_payments_updated_at();

-- Create index for faster lookups
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_stripe_session_id ON public.payments(stripe_session_id);