import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Ask = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('questions')
        .insert([
          {
            name,
            email,
            question,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast.success('Sorunuz başarıyla gönderildi. En kısa sürede yanıtlanacaktır.');
      navigate('/');
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('Sorunuz gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container-content max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-coffee-100 mb-2">
            Soru Sor
          </h1>
          <p className="text-coffee-600 dark:text-coffee-300 mb-8">
            Tarih, kültür ve toplum konularında merak ettiğiniz soruları bana iletebilirsiniz. 
            Sorularınız, içeriklerimi zenginleştirmek ve okuyucuların ilgisini çeken konulara değinmek için kullanılacaktır.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-coffee-800/40 p-6 rounded-lg shadow-sm">
            <div>
              <label className="block text-sm font-medium text-coffee-700 dark:text-coffee-300 mb-1">
                Adınız Soyadınız *
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-coffee-200 dark:border-coffee-700"
                placeholder="Adınızı ve soyadınızı girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee-700 dark:text-coffee-300 mb-1">
                E-posta Adresiniz *
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-coffee-200 dark:border-coffee-700"
                placeholder="E-posta adresinizi girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee-700 dark:text-coffee-300 mb-1">
                Sorunuz *
              </label>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                className="min-h-[200px] border-coffee-200 dark:border-coffee-700"
                placeholder="Sorunuzu detaylı bir şekilde yazın..."
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-coffee-700 hover:bg-coffee-800 dark:bg-coffee-600 dark:hover:bg-coffee-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Soruyu Gönder'}
            </Button>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Ask; 