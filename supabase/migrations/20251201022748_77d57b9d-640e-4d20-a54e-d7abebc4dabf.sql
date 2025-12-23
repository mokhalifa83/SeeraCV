-- Fix security issue with update_payments_updated_at function
CREATE OR REPLACE FUNCTION public.update_payments_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;