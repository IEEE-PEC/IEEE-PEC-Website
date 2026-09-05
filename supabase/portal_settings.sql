-- Add portal_settings table for audition event, results release toggle, and WhatsApp onboarding link
CREATE TABLE IF NOT EXISTS public.portal_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  audition_event_name TEXT DEFAULT 'IEEE PEC Auditions 2026-2027',
  results_published BOOLEAN DEFAULT FALSE,
  whatsapp_group_link TEXT DEFAULT '',
  announcement_note TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.portal_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for portal_settings" 
  ON public.portal_settings FOR SELECT USING (true);

CREATE POLICY "Admin write for portal_settings" 
  ON public.portal_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

INSERT INTO public.portal_settings (id, audition_event_name, results_published, whatsapp_group_link)
VALUES ('main', 'IEEE PEC Auditions 2026-2027', false, '')
ON CONFLICT (id) DO NOTHING;
