import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';
import type { SystemVideo } from '@/hooks/useSystemVideos';

interface VideoCardProps {
  video: SystemVideo;
  onPlay: (video: SystemVideo) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay }) => {
  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Play className="h-6 w-6 ml-1" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 
              className="text-lg font-semibold gradient-fluxo-text group-hover:text-rose-600 transition-colors cursor-pointer"
              onClick={() => onPlay(video)}
            >
              {video.title}
            </h3>
            {video.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {video.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;