import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { 
  Trash2, 
  FileText, 
  HelpCircle, 
  Video, 
  Settings, 
  LogOut, 
  Home,
  Menu,
  X,
  ChevronRight,
  Search,
  Bell,
  User,
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Plus,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { ArticleManagement } from '../components/ArticleManagement';
import { Dashboard } from '../components/Dashboard';
import type { Article } from '@/types';

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
  { key: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
  { key: 'articles', label: 'Yazılarım', icon: <FileText size={18} /> },
  { key: 'questions', label: 'Sorular', icon: <HelpCircle size={18} /> },
  { key: 'videos', label: 'Videolar', icon: <Video size={18} /> },
  { key: 'analytics', label: 'Detaylı Analiz', icon: <TrendingUp size={18} /> },
];

// Dashboard stats interface
interface DashboardStats {
  totalArticles: number;
  totalQuestions: number;
  pendingQuestions: number;
  totalVideos: number;
}

export const WriterPanel: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState(() => {
    // Sadece ilk girişte dashboard aç
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'articles' || tab === 'videos' || tab === 'questions' || tab === 'dashboard' || tab === 'analytics') {
      return tab;
    }
    return 'dashboard';
  });
  const [selectedArticleId, setSelectedArticleId] = useState<string | undefined>(undefined);
  const [videoListKey, setVideoListKey] = useState(0);
  const [activeVideoTab, setActiveVideoTab] = useState('list');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const queryClient = useQueryClient();
  const [editedName, setEditedName] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedQuestion, setEditedQuestion] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    totalQuestions: 0,
    pendingQuestions: 0,
    totalVideos: 0
  });

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

  // Dashboard stats (gerçek verilerle)
  const { data: totalArticles } = useQuery(['dashboard-articles-count'], async () => {
    const { count, error } = await supabase
      .from('articles')
      .select('id', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  });
  const { data: totalVideos } = useQuery(['dashboard-videos-count'], async () => {
    const { count, error } = await supabase
      .from('videos')
      .select('id', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  });
  const { data: totalQuestions } = useQuery(['dashboard-questions-count'], async () => {
    const { count, error } = await supabase
      .from('questions')
      .select('id', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  });
  const { data: pendingQuestions } = useQuery(['dashboard-pending-questions-count'], async () => {
    const { count, error } = await supabase
      .from('questions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');
    if (error) throw error;
    return count || 0;
  });
  // Son eklenenler
  const { data: lastArticles } = useQuery(['dashboard-last-articles'], async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, created_at')
      .order('created_at', { ascending: false })
      .limit(3);
    if (error) throw error;
    return data || [];
  });
  const { data: lastVideos } = useQuery(['dashboard-last-videos'], async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('id, title, created_at')
      .order('created_at', { ascending: false })
      .limit(3);
    if (error) throw error;
    return data || [];
  });
  const { data: lastQuestions } = useQuery(['dashboard-last-questions'], async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('id, title, created_at')
      .order('created_at', { ascending: false })
      .limit(3);
    if (error) throw error;
    return data || [];
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (totalArticles && totalVideos && totalQuestions && pendingQuestions) {
      setStats({
        totalArticles: totalArticles,
        totalQuestions: totalQuestions,
        pendingQuestions: pendingQuestions,
        totalVideos: totalVideos
      });
    }
  }, [totalArticles, totalVideos, totalQuestions, pendingQuestions]);

  // URL'den tab parametresini oku
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'articles' || tab === 'videos' || tab === 'questions' || tab === 'dashboard' || tab === 'analytics') {
      setActivePage(tab);
    }
  }, [location.search]);

  const handleSelectTab = (value: string) => {
    setActivePage(value);
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
    <div className="min-h-screen bg-[#18120b] dark:bg-[#18120b]">
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-56 bg-[#18120b] dark:bg-[#18120b] shadow-lg rounded-xl transform transition-transform duration-300 ease-in-out z-40 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-coffee-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-coffee-600 to-coffee-400 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-coffee-100 leading-tight">Yavşak Çakır</h2>
              <p className="text-xs text-coffee-400">Yazar Paneli</p>
            </div>
          </div>

          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {menuItems.map(item => (
              <button
                key={item.key}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium
                  ${activePage === item.key 
                    ? 'bg-coffee-800 text-coffee-100' 
                    : 'text-coffee-300 hover:bg-coffee-900 hover:text-coffee-100'}
                `}
                onClick={() => setActivePage(item.key)}
              >
                {item.icon}
                <span>{item.label}</span>
                <ChevronRight size={14} className={`ml-auto transition-transform ${activePage === item.key ? 'rotate-90' : ''}`} />
              </button>
            ))}
          </nav>

          <div className="p-2 border-t border-coffee-800 space-y-1">
            <Button
              variant="ghost"
              className="w-full flex items-center gap-2 text-coffee-300 hover:bg-coffee-900 hover:text-coffee-100 text-sm"
              onClick={() => navigate('/')}
            >
              <Home size={16} /> Siteye Dön
            </Button>
            <Button
              variant="ghost"
              className="w-full flex items-center gap-2 text-red-400 hover:bg-coffee-900 hover:text-red-300 text-sm"
              onClick={() => { logout(); navigate('/'); }}
            >
              <LogOut size={16} /> Çıkış Yap
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : ''}`}>
        {/* Header */}
        <header className="h-16 bg-[#18120b] dark:bg-[#18120b] shadow-sm flex items-center px-6 justify-between sticky top-0 z-30 border-b border-coffee-800 rounded-xl">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-coffee-100 dark:text-coffee-100">
              {menuItems.find(i => i.key === activePage)?.label}
            </h1>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {activePage === 'dashboard' && (
              <Dashboard />
            )}
            {activePage === 'articles' && (
              <div className="space-y-6 bg-coffee-900 dark:bg-coffee-950 rounded-xl shadow p-6 border border-coffee-800">
                {/* Article Management */}
                <ArticleManagement onArticleSaved={() => {
                  // Refresh dashboard stats
                  queryClient.invalidateQueries(['dashboard-articles-count']);
                  queryClient.invalidateQueries(['dashboard-last-articles']);
                }} />
              </div>
            )}
            {activePage === 'questions' && (
              <div className="rounded-xl border border-coffee-800 overflow-x-auto w-full bg-[#18120b]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-coffee-900 text-coffee-200 border-b border-coffee-800">Ad Soyad</TableHead>
                      <TableHead className="bg-coffee-900 text-coffee-200 border-b border-coffee-800">E-posta</TableHead>
                      <TableHead className="bg-coffee-900 text-coffee-200 border-b border-coffee-800">Soru</TableHead>
                      <TableHead className="bg-coffee-900 text-coffee-200 border-b border-coffee-800">Durum</TableHead>
                      <TableHead className="bg-coffee-900 text-coffee-200 border-b border-coffee-800">Tarih</TableHead>
                      <TableHead className="bg-coffee-900 text-coffee-200 border-b border-coffee-800">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions?.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="bg-coffee-800 text-coffee-100 border-b border-coffee-700">{question.name}</TableCell>
                        <TableCell className="bg-coffee-800 text-coffee-100 border-b border-coffee-700">{question.email}</TableCell>
                        <TableCell className="bg-coffee-800 text-coffee-100 border-b border-coffee-700">{question.question.length > 60 ? question.question.slice(0, 60) + '...' : question.question}</TableCell>
                        <TableCell className="bg-coffee-800 text-coffee-100 border-b border-coffee-700">
                          <Badge className="bg-coffee-800 text-coffee-100 border-coffee-700" variant={question.status === 'pending' ? 'outline' : 'default'}>
                            {question.status === 'pending' ? 'Beklemede' : 'Yanıtlandı'}
                          </Badge>
                        </TableCell>
                        <TableCell className="bg-coffee-800 text-coffee-100 border-b border-coffee-700">{new Date(question.created_at).toLocaleDateString('tr-TR')}</TableCell>
                        <TableCell className="bg-coffee-800 text-coffee-100 border-b border-coffee-700">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-coffee-800 hover:bg-coffee-700 text-coffee-100 border-coffee-700"
                            onClick={() => handleViewQuestion(question)}
                          >
                            Görüntüle
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-coffee-800 hover:bg-coffee-700 text-coffee-100 border-coffee-700"
                            onClick={() => deleteMutation.mutate({ questionId: question.id })}
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
              <div className="bg-coffee-900 p-6 rounded-lg shadow-sm">
                <VideoForm onSave={handleVideoSave} />
                <div className="mt-6">
                  <VideoList key={videoListKey} />
                </div>
              </div>
            )}
            {activePage === 'analytics' && (
              <AnalyticsPanel />
            )}
          </div>
        </main>
      </div>

      <Dialog open={!!selectedQuestion} onOpenChange={() => {
        setSelectedQuestion(null);
        setAnswer('');
        setEditedName('');
        setEditedTitle('');
        setEditedQuestion('');
      }}>
        <DialogContent className="max-w-3xl w-full min-h-[60vh] max-h-[90vh] overflow-y-auto">
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
                  className="flex-1 min-w-[120px] h-10 px-4 py-2 text-base"
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
                  className="bg-coffee-800 hover:bg-coffee-700 text-coffee-100 border-coffee-700 flex-1 min-w-[120px] h-10 px-4 py-2 text-base"
                >
                  {updateMutation.isLoading ? 'İşleniyor...' : 'Güncelle'}
                </Button>
                <Button
                  onClick={handleAnswer}
                  disabled={answerMutation.isLoading || !answer.trim()}
                  className="bg-coffee-800 hover:bg-coffee-700 text-coffee-100 border-coffee-700 flex-1 min-w-[120px] h-10 px-4 py-2 text-base"
                >
                  {answerMutation.isLoading ? 'İşleniyor...' : 'Yanıtı Kaydet'}
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={answerMutation.isLoading || !answer.trim()}
                  className="bg-coffee-800 hover:bg-coffee-700 text-coffee-100 border-coffee-700 flex-1 min-w-[120px] h-10 px-4 py-2 text-base"
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

const AnalyticsPanel = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, views, status, created_at');
      if (!error && data) setArticles(data as Article[]);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  if (loading) {
    return <div className="text-center text-coffee-400 py-12">Yükleniyor...</div>;
  }

  // Okunma grafiği için veri
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
  // Yayınlanma durumu
  const published = articles.filter(a => a.status === 'published').length;
  const draft = articles.filter(a => a.status === 'draft').length;
  // Tarihe göre yayınlanma (son 12 ay)
  const byMonth: Record<string, number> = {};
  articles.forEach(a => {
    const d = new Date(a.created_at);
    const key = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}`;
    byMonth[key] = (byMonth[key] || 0) + 1;
  });
  const months = Object.keys(byMonth).sort();

  return (
    <div className="bg-coffee-900 dark:bg-coffee-950 rounded-xl shadow p-6 border border-coffee-800">
      <h2 className="text-2xl font-bold text-white mb-6">Detaylı Analiz - Beta Aşamasında </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#18120b] rounded-xl p-6 shadow border border-coffee-800">
          <h3 className="text-lg font-semibold text-white mb-4">Makale Okunma Grafiği</h3>
          <div className="h-64 flex flex-col items-center justify-center text-coffee-100">
            <div className="text-4xl font-bold mb-2">{totalViews}</div>
            <div className="text-coffee-400">Toplam Okunma</div>
            <div className="mt-4 text-coffee-400 text-sm">{articles.length} makale</div>
          </div>
        </div>
        <div className="bg-[#18120b] rounded-xl p-6 shadow border border-coffee-800">
          <h3 className="text-lg font-semibold text-white mb-4">Yayınlanma Durumu</h3>
          <div className="h-64 flex flex-col items-center justify-center text-coffee-100">
            <div className="text-3xl font-bold">{published}</div>
            <div className="text-coffee-400 mb-4">Yayında</div>
            <div className="text-3xl font-bold">{draft}</div>
            <div className="text-coffee-400">Taslak</div>
          </div>
        </div>
      </div>
      <div className="bg-[#18120b] rounded-xl p-6 shadow border border-coffee-800 mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Tarihe Göre Makale Yayınlanma</h3>
        <div className="h-64 flex flex-col items-center justify-center text-coffee-100">
          {months.length === 0 ? (
            <div className="text-coffee-400">Veri yok</div>
          ) : (
            <ul className="w-full max-w-md mx-auto">
              {months.map(m => (
                <li key={m} className="flex justify-between border-b border-coffee-800 py-1">
                  <span>{m}</span>
                  <span>{byMonth[m]} makale</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriterPanel; 