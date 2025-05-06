import { useEffect, useState } from "react";

interface UnsplashImage {
  urls: {
    regular: string;
  };
  alt_description?: string;
}

interface LocationImageResult {
  image: UnsplashImage | null;
  imageLoading: boolean;
  error: string | null;
}

const useLocationImage = (country: string): LocationImageResult => {
  const [result, setResult] = useState<LocationImageResult>({
    image: null,
    imageLoading: false,
    error: null,
  });

  useEffect(() => {
    const fetchCityImage = async () => {
      if (!country.trim()) return;

      setResult(prev => ({ ...prev, imageLoading: true, error: null }));

      try {
        const query = `${country} cityscape`;
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=1&per_page=1&orientation=landscape&order_by=curated&client_id=iQBIHDN-auPaeczwibrxkViuVbJsNHblCjtiuN8U5YM`;


        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const firstImage = data.results?.[0] ?? null;

        setResult({
          image: firstImage,
          imageLoading: false,
          error: null,
        });
      } catch (error) {
        setResult({
          image: null,
          imageLoading: false,
          error: error instanceof Error ? error.message : "Failed to fetch city image",
        });
      }
    };

    fetchCityImage();
  }, [location]);

  return result;
};

export default useLocationImage;
