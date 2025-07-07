import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { convertToEmbedUrl } from '@/utils/youtube';
import type { SystemVideo } from '@/hooks/useSystemVideos';

interface VideoPlayerProps {
  video: SystemVideo | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isOpen, onClose }) => {
  if (!video) return null;

  const embedUrl = convertToEmbedUrl(video.youtube_url);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="gradient-fluxo-text text-xl font-bold">
            {video.title}
          </DialogTitle>
          {video.description && (
            <p className="text-gray-600 text-sm mt-2">
              {video.description}
            </p>
          )}
        </DialogHeader>
        
        <div className="flex-1 p-6 pt-4">
          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={embedUrl}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;