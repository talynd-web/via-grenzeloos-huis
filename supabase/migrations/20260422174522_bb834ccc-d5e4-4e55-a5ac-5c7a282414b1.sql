DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

CREATE TYPE public.app_role_new AS ENUM ('prospect', 'client', 'admin');

ALTER TABLE public.user_roles
  ALTER COLUMN role TYPE public.app_role_new
  USING (
    CASE role::text
      WHEN 'user' THEN 'prospect'
      ELSE role::text
    END
  )::public.app_role_new;

DROP TYPE public.app_role;
ALTER TYPE public.app_role_new RENAME TO app_role;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''));

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'prospect');

  RETURN NEW;
END;
$$;

ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS preferred_market,
  ADD COLUMN IF NOT EXISTS markets text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS quiz_data jsonb,
  ADD COLUMN IF NOT EXISTS traject_stage int,
  ADD COLUMN IF NOT EXISTS next_action text,
  ADD COLUMN IF NOT EXISTS next_action_date date;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_traject_stage_check'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_traject_stage_check
      CHECK (traject_stage BETWEEN 1 AND 4);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  filename text NOT NULL,
  file_path text NOT NULL,
  uploaded_by uuid,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can view all documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can create documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can update documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can delete documents" ON public.documents;

CREATE POLICY "Users can view their own documents"
ON public.documents
FOR SELECT
TO authenticated
USING (auth.uid() = client_id);

CREATE POLICY "Admins can view all documents"
ON public.documents
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create documents"
ON public.documents
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update documents"
ON public.documents
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete documents"
ON public.documents
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "Document owners can read their files" ON storage.objects;
DROP POLICY IF EXISTS "Document owners can upload their files" ON storage.objects;
DROP POLICY IF EXISTS "Document owners can update their files" ON storage.objects;
DROP POLICY IF EXISTS "Document owners can delete their files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all document files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload document files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update document files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete document files" ON storage.objects;

CREATE POLICY "Document owners can read their files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Document owners can upload their files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Document owners can update their files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Document owners can delete their files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can read all document files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload document files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update document files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete document files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_documents_client_id ON public.documents (client_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON public.documents (uploaded_by);