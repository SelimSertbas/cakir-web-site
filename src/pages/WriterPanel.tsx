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
import { Trash2, FileText, HelpCircle, Video, Settings, LogOut, Home } from 'lucide-react';

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

// Sidebar menu items
const menuItems = [
  { key: 'articles', label: 'Yazılarım', icon: <FileText size={18} /> },
  { key: 'questions', label: 'Sorular', icon: <HelpCircle size={18} /> },
  { key: 'videos', label: 'Videolar', icon: <Video size={18} /> },
  { key: 'settings', label: 'Ayarlar', icon: <Settings size={18} /> },
];

const WriterPanel: React.FC = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('articles');
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

  // Layout
  return (
    <div className="min-h-screen flex bg-coffee-50">
      {/* Sidebar */}
      <aside className="w-64 bg-coffee-900 text-white flex flex-col py-6 px-4 shadow-lg">
        <div className="mb-10 flex items-center gap-2 px-2">
          <Home size={28} className="text-coffee-200" />
          <span className="font-serif text-2xl font-bold tracking-tight">Yazar Paneli</span>
        </div>
        <nav className="flex-1 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.key}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium text-base ${activePage === item.key ? 'bg-coffee-700 text-white' : 'hover:bg-coffee-800 text-coffee-200'}`}
              onClick={() => setActivePage(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-10 flex flex-col gap-2">
          <Button
            variant="ghost"
            className="w-full flex items-center gap-2 text-coffee-200 hover:bg-coffee-800 justify-center"
            onClick={() => navigate('/')}
          >
            <Home size={18} /> Siteye Dön
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-600 hover:text-white justify-center"
            onClick={() => { logout(); navigate('/'); }}
          >
            <LogOut size={18} /> Çıkış Yap
          </Button>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center px-8 justify-between">
          <div className="font-serif text-xl font-semibold text-coffee-900">{menuItems.find(i => i.key === activePage)?.label}</div>
          {/* Kullanıcı adı veya avatar eklenebilir */}
        </header>
        <main className="flex-1 p-8 overflow-y-auto bg-coffee-50">
          {/* Sayfa içerikleri */}
          {activePage === 'articles' && (
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
          )}
          {activePage === 'questions' && (
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
          )}
          {activePage === 'videos' && (
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
          )}
          {activePage === 'settings' && (
            <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-4">Ayarlar</h2>
              <p className="text-coffee-700">Profil ve panel ayarları burada olacak (örnek alan).</p>
            </div>
          )}
        </main>
      </div>

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