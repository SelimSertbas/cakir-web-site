import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Youtube } from 'lucide-react';
import { Loading } from '../components/ui/loading';

interface Video {
  id: string;
  title: string;
  video_url: string;
  video_id: string;
  created_at: string;
  updated_at: string;
}

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading videos:', error);
        throw error;
      }

      if (data) {
        setVideos(data);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: tr });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FAF6F2] to-[#F3EBE2] dark:from-coffee-900 dark:to-coffee-950">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container-content">
          <div className="flex items-center gap-3 mb-8">
            <Youtube className="h-8 w-8 text-coffee-800 dark:text-coffee-200" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-coffee-100">
              Videolar
            </h1>
          </div>

          {isLoading ? (
            <Loading fullScreen text="Videolar yükleniyor..." />
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-coffee-600 dark:text-coffee-400 text-lg">
                Henüz video bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white dark:bg-coffee-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
                >
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.video_id}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-medium text-coffee-900 dark:text-coffee-100 mb-2">
                      {video.title}
                    </h2>
                    <p className="text-sm text-coffee-500 dark:text-coffee-400">
                      {formatDate(video.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Videos;
