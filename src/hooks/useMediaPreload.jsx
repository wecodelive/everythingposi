import { useEffect, useState } from "react";

/**
 * Hook to preload images and videos
 * @param {string|string[]} urls - Single URL or array of URLs to preload
 * @param {string} type - 'image' or 'video' (auto-detected from extension if not provided)
 * @returns {object} { isLoading, isLoaded, error }
 */
export const useMediaPreload = (urls, type = null) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!urls) return;

    const urlArray = Array.isArray(urls) ? urls : [urls];
    let loadedCount = 0;
    let errorCount = 0;

    const preloadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
    };

    const preloadVideo = (url) => {
      return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.onloadeddata = resolve;
        video.onerror = reject;
        video.preload = "auto";
        const source = document.createElement("source");
        source.src = url;
        source.type = "video/mp4";
        video.appendChild(source);
      });
    };

    const getMediaType = (url) => {
      if (type) return type;
      const extension = url.split(".").pop().toLowerCase();
      return ["mp4", "webm", "ogg"].includes(extension) ? "video" : "image";
    };

    const preloadMedia = async () => {
      setIsLoading(true);
      setError(null);
      loadedCount = 0;
      errorCount = 0;

      const promises = urlArray.map((url) => {
        const mediaType = getMediaType(url);
        const preloader = mediaType === "video" ? preloadVideo : preloadImage;

        return preloader(url)
          .then(() => {
            loadedCount++;
          })
          .catch((err) => {
            console.warn(`Failed to preload ${mediaType}: ${url}`, err);
            errorCount++;
          });
      });

      await Promise.all(promises);

      if (errorCount > 0 && loadedCount === 0) {
        setError(`Failed to load ${errorCount} media file(s)`);
      }

      setIsLoaded(true);
      setIsLoading(false);
    };

    preloadMedia();
  }, [urls, type]);

  return { isLoading, isLoaded, error };
};

/**
 * Utility function to preload multiple media files
 * Useful for preloading product images, category images, etc.
 */
export const preloadMedia = async (urls) => {
  const urlArray = Array.isArray(urls) ? urls : [urls];

  const preloadImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve; // Resolve even on error to not block other loads
      img.src = url;
    });
  };

  const preloadVideo = (url) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.onloadeddata = resolve;
      video.onerror = resolve;
      video.preload = "auto";
      const source = document.createElement("source");
      source.src = url;
      source.type = "video/mp4";
      video.appendChild(source);
    });
  };

  const getMediaType = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    return ["mp4", "webm", "ogg"].includes(extension) ? "video" : "image";
  };

  const promises = urlArray.map((url) => {
    const mediaType = getMediaType(url);
    return mediaType === "video" ? preloadVideo(url) : preloadImage(url);
  });

  return Promise.all(promises);
};
