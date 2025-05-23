import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loading } from '@/components/ui/loading';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: article, isLoading } = useQuery<Article | null>(
    ['article', id],
    async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching article:", error);
        return null;
      }
      return data as Article | null;
    }
  );

  const formatDateSafe = (dateString: string | undefined) => {
    if (!dateString) return 'Belirtilmemiş';
    try {
      return format(new Date(dateString), 'd MMMM yyyy HH:mm', { locale: tr });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Geçersiz Tarih';
    }
  };

  if (isLoading) {
    return <Loading text="Makale yükleniyor..." />;
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow py-16">
          <div className="container-content max-w-4xl mx-auto">
            <p>Makale bulunamadı veya yüklenirken bir hata oluştu.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="container-content">
          <article className="prose prose-coffee max-w-none dark:prose-invert">
            <h1 className="text-4xl font-serif text-coffee-900 dark:text-coffee-100 mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center text-sm text-coffee-500 dark:text-coffee-400 mb-8">
              <span>{formatDateSafe(article.published_at)}</span>
              <span className="mx-2">•</span>
              <span>{article.category}</span>
            </div>

            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full rounded-lg mb-8 max-h-[500px] object-cover"
              />
            )}

            <div className="text-coffee-600 dark:text-coffee-300 text-lg mb-8">
              {article.excerpt}
            </div>

            <div
              className="text-coffee-800 dark:text-coffee-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
