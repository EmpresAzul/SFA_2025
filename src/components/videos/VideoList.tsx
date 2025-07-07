import React, { useState } from 'react';
import { useSystemVideos, type SystemVideo } from '@/hooks/useSystemVideos';
import VideoCard from './VideoCard';
import VideoPlayer from './VideoPlayer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

const VideoList: React.FC = () => {
  const { data: videos, isLoading, error } = useSystemVideos();
  const [selectedVideo, setSelectedVideo] = useState<SystemVideo | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);

  const handlePlayVideo = (video: SystemVideo) => {
    setSelectedVideo(video);
    setPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setPlayerOpen(false);
    setSelectedVideo(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="border rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar os vídeos. Tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Nenhum vídeo tutorial disponível no momento.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onPlay={handlePlayVideo}
          />
        ))}
      </div>

      <VideoPlayer
        video={selectedVideo}
        isOpen={playerOpen}
        onClose={handleClosePlayer}
      />
    </>
  );
};

export default VideoList;