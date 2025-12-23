-- Add DELETE policy for profiles table to allow users to delete their own profile
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);