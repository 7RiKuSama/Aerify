import { useEffect, useState } from "react";
import { Suggestion } from "../types/weather";

const useAutocompleteLocation = () => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    if (searchText.length < 3) return;

    const controller = new AbortController(); // to cancel previous request

    const timeoutId = setTimeout(() => {
      const fetchSuggestions = async () => {
        try {
          const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            searchText
          )}&key=a95b760cf9d24586a9e86e7c88e60734`;

          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) throw new Error("Failed to fetch suggestions");

          const data = await response.json();

          const mappedSuggestions: Suggestion[] = data.results.map((row: any) => ({
            country: row.components.country || null,
            city: row.components.city || null,
            county: row.components.county || null,
            state: row.components.state || null,
            province: row.components.province || null,
            formatted: row.formatted || null,
          }));

          setSuggestions(mappedSuggestions);
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") return;
          console.error(err);
        }
      };

      fetchSuggestions();
    }, 300); // delay like debounce

    return () => {
      clearTimeout(timeoutId); // cancel the timeout if input changes
      controller.abort(); // cancel the fetch if still pending
    };
  }, [searchText]);

  return { suggestions, searchText, setSearchText };
};

export default useAutocompleteLocation;
