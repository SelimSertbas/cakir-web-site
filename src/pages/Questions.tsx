import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Loading } from '@/components/ui/loading';

interface Question {
  id: string;
  title: string;
  name: string;
  email: string;
  question: string;
  answer: string | null;
  created_at: string;
  status: 'pending' | 'answered';
}

const Questions = () => {
  const { data: questions, isLoading } = useQuery<Question[]>({
    queryKey: ['questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <Loading text="Sorular yükleniyor..." />;
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-coffee-600 dark:text-coffee-400">
          Henüz soru bulunmuyor.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container-content max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-coffee-100 mb-8">
            Soru & Cevap
          </h1>

          <div className="space-y-6">
            {questions.map((question) => (
              <div
                key={question.id}
                className="bg-white dark:bg-coffee-900 p-6 rounded-lg shadow-sm border border-coffee-100 dark:border-coffee-800"
              >
                <h2 className="text-xl font-semibold text-coffee-900 dark:text-coffee-100 mb-2">
                  {question.title}
                </h2>
                <p className="text-sm text-coffee-600 dark:text-coffee-400 mb-4">
                  {question.name} • {format(new Date(question.created_at), 'd MMMM yyyy', { locale: tr })}
                </p>
                <p className="text-coffee-700 dark:text-coffee-300 mb-4">
                  {question.question}
                </p>
                {question.answer && (
                  <div className="mt-4 pt-4 border-t border-coffee-100 dark:border-coffee-800">
                    <h3 className="text-lg font-medium text-coffee-800 dark:text-coffee-200 mb-2">
                      Cevap
                    </h3>
                    <p className="text-coffee-700 dark:text-coffee-300">
                      {question.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Questions; 