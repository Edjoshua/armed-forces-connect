CREATE POLICY "Users can delete their own pending dependents"
  ON public.dependents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending');