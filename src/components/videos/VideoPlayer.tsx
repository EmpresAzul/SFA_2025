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
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] max-h-[90vh] p-0 overflow-hidden sm:max-w-6xl md:max-w-7xl">
        <DialogHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
          <DialogTitle className="gradient-fluxo-text text-xl sm:text-2xl font-bold">
            {video.title}
          </DialogTitle>
          {video.description && (
            <p className="text-gray-600 text-sm sm:text-base mt-2 sm:mt-3 leading-relaxed">
              {video.description}
            </p>
          )}
        </DialogHeader>
        
        <div className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="relative w-full h-full rounded-lg sm:rounded-xl overflow-hidden shadow-xl sm:shadow-2xl bg-black">
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