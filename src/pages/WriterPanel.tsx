import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, isAuthenticated } from '../lib/auth';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArticleList } from '../components/ArticleList';
import { ArticleForm } from '../components/ArticleForm';
import { VideoList } from '../components/VideoList';
import { VideoForm } from '../components/VideoForm';
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Trash2 } from 'lucide-react';

interface Question {
  id: string;
  name: string;
  email: string;
  title: string;
  question: string;
  status: 'pending' | 'answered';
  created_at: string;
  answer: string | null;
  is_published: boolean;
}

const WriterPanel: React.FC = () => {
  const navigate = useNavigate();
  const [selectedArticleId, setSelectedArticleId] = useState<string | undefined>(undefined);
  const [videoListKey, setVideoListKey] = useState(0);
  const [activeVideoTab, setActiveVideoTab] = useState('list');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const queryClient = useQueryClient();
  const [editedName, setEditedName] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedQuestion, setEditedQuestion] = useState('');

  const { data: questions } = useQuery({
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

  const answerMutation = useMutation<void, Error, { questionId: string; answer: string; isPublished: boolean }>({
    mutationFn: async ({ questionId, answer, isPublished }) => {
      const { error } = await supabase
        .from('questions')
        .update({
          answer,
          status: 'answered',
          is_published: isPublished
        })
        .eq('id', questionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setSelectedQuestion(null);
      setAnswer('');
      toast.success('Yanıt başarıyla kaydedildi.');
    },
    onError: () => {
      toast.error('Yanıt kaydedilirken bir hata oluştu.');
    }
  });

  const updateMutation = useMutation<void, Error, { questionId: string; name: string; title: string; question: string }>({
    mutationFn: async ({ questionId, name, title, question }) => {
      const { error } = await supabase
        .from('questions')
        .update({
          name,
          title,
          question
        })
        .eq('id', questionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast.success('Soru başarıyla güncellendi.');
    },
    onError: () => {
      toast.error('Soru güncellenirken bir hata oluştu.');
    }
  });

  const deleteMutation = useMutation<void, Error, { questionId: string }>({
    mutationFn: async ({ questionId }) => {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast.success('Soru silindi.');
    },
    onError: () => {
      toast.error('Soru silinirken hata oluştu.');
    }
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSelectTab = (value: string) => {
    if (value === 'articles') {
      setSelectedArticleId(undefined);
    }
  };

  const handleVideoSave = () => {
    // VideoList'i yenilemek için key'i değiştir
    setVideoListKey(prev => prev + 1);
    // Liste sekmesine geç
    setActiveVideoTab('list');
  };

  const handleViewQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setAnswer(question.answer || '');
    setEditedName(question.name);
    setEditedTitle(question.title);
    setEditedQuestion(question.question);
  };

  const handleAnswer = () => {
    if (selectedQuestion && answer.trim()) {
      answerMutation.mutate({
        questionId: selectedQuestion.id,
        answer: answer.trim(),
        isPublished: false
      });
    }
  };

  const handlePublish = () => {
    if (selectedQuestion && answer.trim()) {
      answerMutation.mutate({
        questionId: selectedQuestion.id,
        answer: answer.trim(),
        isPublished: true
      });
    }
  };

  const handleUpdate = () => {
    if (selectedQuestion) {
      updateMutation.mutate({
        questionId: selectedQuestion.id,
        name: editedName,
        title: editedTitle,
        question: editedQuestion
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-coffee-100">
      <header className="bg-coffee-800 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="font-serif text-2xl font-medium text-coffee-50">
            Yazar Paneli
          </h1>
          
          <div className="flex items-center gap-4">
            <Button 
              type="button" 
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-coffee-50 hover:text-white hover:bg-coffee-700"
            >
              Siteye Dön
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={handleLogout}
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600"
            >
              Çıkış Yap
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="articles" onValueChange={handleSelectTab} 
                className="bg-coffee-50 p-6 rounded-lg shadow-md">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="articles" className="data-[state=active]:bg-coffee-600 data-[state=active]:text-white">
                Yazılarım
              </TabsTrigger>
              <TabsTrigger value="questions" className="data-[state=active]:bg-coffee-600 data-[state=active]:text-white">
                Sorular
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-coffee-600 data-[state=active]:text-white">
                Ayarlar
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="articles">
              <Tabs defaultValue={selectedArticleId ? "edit" : "list"} 
                    className="bg-white p-6 rounded-lg shadow-sm">
                <TabsList className="mb-8 bg-coffee-100">
                  <TabsTrigger value="list" className="data-[state=active]:bg-coffee-600 data-[state=active]:text-white">
                    Yazılarım
                  </TabsTrigger>
                  <TabsTrigger value="edit" className="data-[state=active]:bg-coffee-600 data-[state=active]:text-white">
                    {selectedArticleId ? 'Makaleyi Düzenle' : 'Yeni Makale'}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="list">
                  <ArticleList onEdit={setSelectedArticleId} />
                </TabsContent>
                
                <TabsContent value="edit">
                  <ArticleForm 
                    articleId={selectedArticleId} 
                    onSave={() => setSelectedArticleId(undefined)}
                  />
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            <TabsContent value="questions" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ad Soyad</TableHead>
                      <TableHead>E-posta</TableHead>
                      <TableHead>Soru</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions?.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell>{question.name}</TableCell>
                        <TableCell>{question.email}</TableCell>
                        <TableCell className="max-w-md truncate">{question.question}</TableCell>
                        <TableCell>
                          <Badge variant={question.status === 'pending' ? 'outline' : 'default'}>
                            {question.status === 'pending' ? 'Beklemede' : 'Yanıtlandı'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(question.created_at).toLocaleDateString('tr-TR')}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewQuestion(question)}
                          >
                            Görüntüle
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate({ questionId: question.id })}
                            className="text-red-600 hover:bg-red-100"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="videos">
              <Tabs value={activeVideoTab} onValueChange={setActiveVideoTab} 
                    className="bg-white p-6 rounded-lg shadow-sm">
                <TabsList className="mb-8 bg-coffee-100">
                  <TabsTrigger value="list" className="data-[state=active]:bg-coffee-600 data-[state=active]:text-white">
                    Videolar
                  </TabsTrigger>
                  <TabsTrigger value="add" className="data-[state=active]:bg-coffee-600 data-[state=active]:text-white">
                    Yeni Video
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="list">
                  <VideoList key={videoListKey} />
                </TabsContent>
                
                <TabsContent value="add">
                  <VideoForm 
                    onSave={handleVideoSave}
                  />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={!!selectedQuestion} onOpenChange={() => {
        setSelectedQuestion(null);
        setAnswer('');
        setEditedName('');
        setEditedTitle('');
        setEditedQuestion('');
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Soru Detayı</DialogTitle>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Ad Soyad</h3>
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="border-coffee-200 dark:border-coffee-700"
                />
              </div>
              <div>
                <h3 className="font-medium mb-2">Başlık</h3>
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="border-coffee-200 dark:border-coffee-700"
                />
              </div>
              <div>
                <h3 className="font-medium mb-2">Soru</h3>
                <Textarea
                  value={editedQuestion}
                  onChange={(e) => setEditedQuestion(e.target.value)}
                  className="min-h-[100px] border-coffee-200 dark:border-coffee-700"
                />
              </div>
              <div>
                <h3 className="font-medium">Tarih</h3>
                <p className="text-muted-foreground">
                  {new Date(selectedQuestion.created_at).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Yanıt</h3>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Soruyu yanıtlayın..."
                  className="min-h-[200px]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedQuestion(null);
                    setAnswer('');
                  }}
                >
                  Kapat
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={updateMutation.isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {updateMutation.isLoading ? 'İşleniyor...' : 'Güncelle'}
                </Button>
                <Button
                  onClick={handleAnswer}
                  disabled={answerMutation.isLoading || !answer.trim()}
                >
                  {answerMutation.isLoading ? 'İşleniyor...' : 'Yanıtı Kaydet'}
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={answerMutation.isLoading || !answer.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {answerMutation.isLoading ? 'İşleniyor...' : 'Yanıtı Yayınla'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WriterPanel; 