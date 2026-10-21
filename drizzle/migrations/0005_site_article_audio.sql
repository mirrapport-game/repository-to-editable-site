ALTER TABLE public.site_articles ADD COLUMN audio_url TEXT;
ALTER TABLE public.site_articles ADD COLUMN audio_title TEXT;

COMMENT ON COLUMN public.site_articles.audio_url IS 'Публичный адрес трека на тему статьи в хранилище';

-- Публичное чтение файлов треков
CREATE POLICY "Anyone can read article audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-audio');

-- Загрузка, замена и удаление трека только для администраторов
CREATE POLICY "Admins can upload article audio"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'article-audio' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update article audio"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'article-audio' AND public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (bucket_id = 'article-audio' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete article audio"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'article-audio' AND public.has_role(auth.uid(), 'admin'::public.app_role));