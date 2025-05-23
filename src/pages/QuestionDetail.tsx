import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: question, isLoading } = useQuery<Question>({
    queryKey: ['question', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <Loading text="Soru yükleniyor..." />;
  }

  if (!question) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow py-16">
          <div className="container-content max-w-4xl mx-auto">
            <p>Soru bulunamadı.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container-content max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="mb-8"
            onClick={() => navigate('/questions')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Sorulara Dön
          </Button>

          <div className="bg-white dark:bg-coffee-800/40 p-6 rounded-lg shadow-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-serif font-bold text-coffee-900 dark:text-coffee-100 mb-4">
                {question.title}
              </h1>
              <div className="text-sm text-coffee-600 dark:text-coffee-400">
                {question.name} - {format(new Date(question.created_at), 'd MMMM yyyy', { locale: tr })}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-medium text-coffee-900 dark:text-coffee-100 mb-4">
                  Soru
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-coffee-700 dark:text-coffee-300">
                    {question.question}
                  </p>
                </div>
              </div>

              {question.answer && (
                <div>
                  <h2 className="text-xl font-medium text-coffee-900 dark:text-coffee-100 mb-4">
                    Yanıt
                  </h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-coffee-700 dark:text-coffee-300">
                      {question.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuestionDetail; 