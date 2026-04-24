import { useState, useEffect } from "react";

export function useCMS(page: string) {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cacheKey = `sru_cms_cache_${page}`;
    
    // Load from cache initially if available
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setContent(JSON.parse(cached));
        setLoading(false); // We have at least some content
      } catch (e) {
        console.error("Cache parse error", e);
      }
    }

    async function fetchContent(retries = 3) {
      try {
        const res = await fetch(`/api/content?page=${page}`);
        if (res.ok) {
          const data = await res.json();
          setContent(data);
          // Update cache on success
          localStorage.setItem(cacheKey, JSON.stringify(data));
        } else if (retries > 0) {
          setTimeout(() => fetchContent(retries - 1), 2000);
        }
      } catch (error) {
        console.error(`Error fetching CMS content for ${page}:`, error);
        if (retries > 0) {
          setTimeout(() => fetchContent(retries - 1), 2000);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [page]);

  const getSection = (section: string, defaults: any) => {
    const item = content.find(c => c.section === section);
    return item ? { ...defaults, ...item.content } : defaults;
  };

  return { content, loading, getSection };
}
