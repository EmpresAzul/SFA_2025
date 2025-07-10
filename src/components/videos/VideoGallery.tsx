import React, { useState } from "react";
import { useSystemVideos, SystemVideo } from "@/hooks/useSystemVideos";
import { convertToEmbedUrl } from "@/utils/youtube";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Play } from "lucide-react";

const VideoGallery: React.FC = () => {
  const { data: videos, isLoading, error } = useSystemVideos();
  const [selected, setSelected] = useState<SystemVideo | null>(null);

  React.useEffect(() => {
    if (videos && videos.length > 0 && !selected) {
      setSelected(videos[0]);
    }
  }, [videos, selected]);

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-8 p-8">
        <div className="flex-1 min-h-[320px] flex items-center justify-center bg-gray-100 rounded-xl">
          <Skeleton className="w-full h-72 rounded-xl" />
        </div>
        <div className="w-full md:w-80 space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
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

  const embedUrl = selected ? convertToEmbedUrl(selected.youtube_url) : "";

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 md:p-8">
      {/* Player do vídeo */}
      <div className="flex-1 min-w-0">
        <div className="bg-black rounded-xl shadow-2xl overflow-hidden aspect-video w-full max-h-[70vh]">
          {selected && (
            <iframe
              src={embedUrl}
              title={selected.title}
              className="w-full h-full min-h-[320px] border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
        {selected && (
          <div className="mt-6">
            <h2 className="gradient-fluxo-text text-2xl font-bold mb-2">
              {selected.title}
            </h2>
            {selected.description && (
              <p className="text-gray-700 text-base leading-relaxed">
                {selected.description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Lista de vídeos */}
      <div className="w-full md:w-80 flex-shrink-0 space-y-2">
        {videos.map((video) => (
          <Card
            key={video.id}
            className={`flex items-center gap-3 p-3 cursor-pointer border-2 transition-all duration-200 ${selected?.id === video.id ? "border-rose-500 bg-rose-50" : "border-transparent hover:border-rose-200"}`}
            onClick={() => setSelected(video)}
          >
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center ${selected?.id === video.id ? "bg-rose-500 text-white" : "bg-gray-200 text-rose-500"}`}
            >
              <Play className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`font-semibold text-sm truncate ${selected?.id === video.id ? "gradient-fluxo-text" : ""}`}
              >
                {video.title}
              </div>
              {video.description && (
                <div className="text-xs text-gray-600 truncate mt-0.5">
                  {video.description}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
