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

const useLocationImage = (city: string): LocationImageResult => {
  const [result, setResult] = useState<LocationImageResult>({
    image: null,
    imageLoading: false,
    error: null,
  });

  useEffect(() => {
    const fetchCityImage = async () => {
      if (!city || !city.trim()) return; // Skip empty city names

      setResult(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const url = `https://api.unsplash.com/search/photos?query=${city}&page=1&per_page=1&client_id=hlw9seAPJY857UvxG2ySdps7dICeGUf8Ba-G3zpnV8k`;

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
          error: error instanceof Error ? error.message : 'Failed to fetch city image',
        });
      }
    };

    fetchCityImage();
  }, [city]);

  return result;
};

export default useLocationImage;