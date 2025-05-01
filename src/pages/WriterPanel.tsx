import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, isAuthenticated } from '../lib/auth';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArticleList } from '../components/ArticleList';
import { ArticleForm } from '../components/ArticleForm';
import { VideoList } from '../components/VideoList';
import { VideoForm } from '../components/VideoForm';

const WriterPanel: React.FC = () => {
  const navigate = useNavigate();
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('articles');
  const [videoListKey, setVideoListKey] = useState(0);
  const [activeVideoTab, setActiveVideoTab] = useState('list');
  
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
    setActiveTab(value);
    if (value === 'articles') {
      setSelectedArticleId(null);
    }
  };

  const handleVideoSave = () => {
    // VideoList'i yenilemek için key'i değiştir
    setVideoListKey(prev => prev + 1);
    // Liste sekmesine geç
    setActiveVideoTab('list');
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
              className="border-coffee-600 text-coffee-50 hover:bg-coffee-700 hover:text-white hover:border-coffee-700"
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
            <TabsList className="mb-8 bg-coffee-200">
              <TabsTrigger value="articles" className="data-[state=active]:bg-coffee-600 data-[state=active]:text-white">
                Makaleler
              </TabsTrigger>
              <TabsTrigger value="videos" className="data-[state=active]:bg-coffee-600 data-[state=active]:text-white">
                Videolar
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="articles">
              <Tabs defaultValue={selectedArticleId ? "edit" : "list"} 
                    className="bg-white p-6 rounded-lg shadow-sm">
                <TabsList className="mb-8 bg-coffee-100">
                  <TabsTrigger value="list" className="data-[state=active]:bg-coffee-600 data-[state=active]:text-white">
                    Makaleler
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
                    onSave={() => setSelectedArticleId(null)}
                  />
                </TabsContent>
              </Tabs>
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
    </div>
  );
};

export default WriterPanel; 