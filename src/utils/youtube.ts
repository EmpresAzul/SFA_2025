/**
 * Converte uma URL do YouTube para o formato embed sem anúncios e vídeos relacionados
 */
export const convertToEmbedUrl = (youtubeUrl: string): string => {
  try {
    // Extrair o ID do vídeo da URL
    const urlObj = new URL(youtubeUrl);
    let videoId = '';

    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v') || '';
    } else if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1);
    }

    if (!videoId) {
      throw new Error('ID do vídeo não encontrado');
    }

    // Retornar URL embed sem anúncios e vídeos relacionados
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&disablekb=1&fs=1`;
  } catch (error) {
    console.error('Erro ao converter URL do YouTube:', error);
    return youtubeUrl;
  }
};

/**
 * Valida se uma URL é do YouTube
 */
export const isValidYouTubeUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be');
  } catch {
    return false;
  }
};