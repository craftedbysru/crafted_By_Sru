import { useState, useEffect } from "react";

export function useCMS(page: string) {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch(`/api/content?page=${page}`);
        if (res.ok) {
          const data = await res.json();
          setContent(data);
        }
      } catch (error) {
        console.error(`Error fetching CMS content for ${page}:`, error);
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
