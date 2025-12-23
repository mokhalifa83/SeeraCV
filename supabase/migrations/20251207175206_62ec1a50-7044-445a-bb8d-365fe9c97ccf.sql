-- Update payments table to track downloads and AI requests used
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS downloads_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_requests_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Update existing payments to set expiration dates
UPDATE public.payments 
SET expires_at = CASE 
  WHEN plan_type = 'professional' THEN created_at + INTERVAL '30 days'
  ELSE created_at + INTERVAL '7 days'
END
WHERE expires_at IS NULL AND status = 'completed';

-- Create a function to auto-delete expired cv_drafts
CREATE OR REPLACE FUNCTION public.cleanup_expired_drafts()
RETURNS void AS $$
DECLARE
  draft_record RECORD;
BEGIN
  -- Delete drafts for users whose payment has expired
  FOR draft_record IN
    SELECT cd.id, cd.user_id
    FROM public.cv_drafts cd
    LEFT JOIN public.payments p ON cd.user_id = p.user_id AND p.status = 'completed'
    WHERE (p.expires_at IS NULL OR p.expires_at < NOW())
    AND cd.created_at < NOW() - INTERVAL '7 days'
  LOOP
    DELETE FROM public.cv_drafts WHERE id = draft_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create support_tickets table for priority support
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  description TEXT NOT NULL,
  is_priority BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on support_tickets
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for support_tickets
CREATE POLICY "Users can create their own tickets"
ON public.support_tickets
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tickets"
ON public.support_tickets
FOR SELECT
USING (auth.uid() = user_id);