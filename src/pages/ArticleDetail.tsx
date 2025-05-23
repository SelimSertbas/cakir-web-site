import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ArticleDetail = () => {
  const { id } = useParams();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-16">
          <div className="container-content">
            <div className="animate-pulse">
              <div className="h-8 bg-coffee-200 dark:bg-coffee-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-coffee-100 dark:bg-coffee-800 rounded w-1/4 mb-8"></div>
              <div className="h-4 bg-coffee-100 dark:bg-coffee-800 rounded w-full mb-3"></div>
              <div className="h-4 bg-coffee-100 dark:bg-coffee-800 rounded w-full mb-3"></div>
              <div className="h-4 bg-coffee-100 dark:bg-coffee-800 rounded w-2/3"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-16">
          <div className="container-content">
            <h1 className="text-3xl font-serif text-coffee-900 dark:text-coffee-100">Makale bulunamadı</h1>
            <p className="text-coffee-600 dark:text-coffee-300 mt-4">
              Aradığınız makale mevcut değil veya kaldırılmış olabilir.
            </p>
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
              <span>{new Date(article.published_at).toLocaleDateString('tr-TR')}</span>
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
