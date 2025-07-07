import React from 'react';
import VideoList from '@/components/videos/VideoList';
import { Video } from 'lucide-react';

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
          Clique no título de qualquer vídeo para assistir e dominar o sistema.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md border-0 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold gradient-fluxo-text mb-2">
            Tutoriais Disponíveis
          </h2>
          <p className="text-gray-600">
            Selecione um vídeo da lista abaixo para começar a assistir
          </p>
        </div>

        <VideoList />
      </div>
    </div>
  );
};

export default VideosSistema;