import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';

const Articles = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('type', 'article')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container-content">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-coffee-100 mb-2">
            Yazılarım
          </h1>
          <p className="text-coffee-600 dark:text-coffee-300 mb-10">
            Tarih, kültür ve toplum üzerine detaylı araştırma ve incelemeler
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading placeholders
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-video bg-coffee-100 dark:bg-coffee-800 rounded-lg mb-4"></div>
                  <div className="h-4 bg-coffee-100 dark:bg-coffee-800 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-coffee-200 dark:bg-coffee-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-coffee-100 dark:bg-coffee-800 rounded w-full"></div>
                </div>
              ))
            ) : (
              articles?.map(article => (
                <ArticleCard 
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  category={article.category}
                  type={article.type}
                  date={new Date(article.published_at).toLocaleDateString('tr-TR')}
                  image={article.image_url}
                />
              ))
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Articles;
