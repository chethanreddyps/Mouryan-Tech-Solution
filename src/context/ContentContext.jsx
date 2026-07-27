import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/api';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

// Older Drive records can contain URLs created while the API ran locally.
// Keep those assets working by routing their API paths through the active API base.
const resolveStoredAssetUrl = (url) => {
  if (!url || !/^https?:\/\/(localhost|127\.0\.0\.1)(?::\d+)?\/api\//i.test(url)) {
    return url;
  }

  const apiPath = new URL(url).pathname;
  return `${API_BASE_URL || ""}${apiPath}`;
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({
    companyInfo: {},
    services: [],
    faqs: [],
    brands: [],
    reviews: [],
    gallery: [],
    loading: true,
    error: null
  });

  const refreshContent = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/content`);
        if (res.ok) {
        const data = await res.json();
        setContent({
          companyInfo: data.companyInfo || {},
          services: data.services || [],
          faqs: data.faqs || [],
          brands: data.brands || [],
          gallery: (data.gallery || []).map((item) => ({
            ...item,
            url: resolveStoredAssetUrl(item.url),
          })),
          reviews: (data.reviews || []).map((item) => ({
            ...item,
            imageUrl: resolveStoredAssetUrl(item.imageUrl),
          })),
          loading: false,
          error: null
        });
        return true;
        } else {
          throw new Error('Drive content could not be loaded.');
        }
      } catch (err) {
      console.warn('Drive content could not be loaded.', err);
      setContent(prev => ({ ...prev, loading: false, error: err.message }));
      return false;
    }
  };

  useEffect(() => {
    let retryTimer;
    let isMounted = true;

    const load = async () => {
      const loaded = await refreshContent();
      if (!loaded && isMounted) retryTimer = window.setTimeout(load, 3000);
    };

    load();
    return () => {
      isMounted = false;
      window.clearTimeout(retryTimer);
    };
  }, []);

  return (
    <ContentContext.Provider value={{ ...content, refreshContent }}>
      {children}
    </ContentContext.Provider>
  );
};
