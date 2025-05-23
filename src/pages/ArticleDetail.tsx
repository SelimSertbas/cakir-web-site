import { useParams, Link } from 'react-router-dom';
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
      if (!id) throw new Error('Article ID is required');
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching article:", error);
        throw error;
      }
      return data as Article;
    },
    {
      enabled: !!id
    }
  );

  // Diğer makaleler
  const { data: otherArticles } = useQuery<Article[]>(
    ['other-articles', id],
    async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, image_url, excerpt')
        .neq('id', id || '')
        .order('published_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data as Article[];
    },
    { enabled: !!id }
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

          {/* Diğer Makalelere Göz At */}
          {otherArticles && otherArticles.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6 text-coffee-800 dark:text-coffee-100">Diğer Makalelere Göz At</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {otherArticles.map((other) => (
                  <Link to={`/articles/${other.id}`} key={other.id} className="block bg-white dark:bg-coffee-900 rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                    {other.image_url && (
                      <img src={other.image_url} alt={other.title} className="w-full h-40 object-cover" />
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-coffee-900 dark:text-coffee-100 mb-2">{other.title}</h3>
                      <p className="text-coffee-700 dark:text-coffee-300 text-sm line-clamp-3">{other.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
