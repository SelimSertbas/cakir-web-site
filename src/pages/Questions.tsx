import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Question {
  id: string;
  name: string;
  title: string;
  question: string;
  answer: string;
  created_at: string;
}

const Questions = () => {
  const { data: questions } = useQuery<Question[]>({
    queryKey: ['questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container-content max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-coffee-100 mb-8">
            Soru & Cevap
          </h1>

          <div className="space-y-6">
            {questions?.map((question) => (
              <Link
                key={question.id}
                to={`/questions/${question.id}`}
                className="block bg-white dark:bg-coffee-800/40 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-medium text-coffee-900 dark:text-coffee-100 mb-2">
                  {question.title}
                </h2>
                <p className="text-sm text-coffee-600 dark:text-coffee-400 mb-4">
                  {question.name} • {new Date(question.created_at).toLocaleDateString('tr-TR')}
                </p>
                <p className="text-coffee-700 dark:text-coffee-300 line-clamp-2">
                  {question.question}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Questions; 