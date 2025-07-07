import React from 'react';
import { Video } from 'lucide-react';
import VideoGallery from '@/components/videos/VideoGallery';

const VideosSistema: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
            <Video className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold gradient-fluxo-text">
            Vídeos do Sistema
          </h1>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">
          Aprenda a usar todas as funcionalidades do FluxoAzul com nossos tutoriais em vídeo. 
          Selecione um vídeo da lista para assistir.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md border-0 p-0">
        <VideoGallery />
      </div>
    </div>
  );
};

export default VideosSistema;