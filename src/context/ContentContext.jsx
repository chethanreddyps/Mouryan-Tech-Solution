import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useContent = () => useContext(ContentContext);

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
        const res = await fetch(`${apiBaseUrl}/api/content`);
        if (res.ok) {
        const data = await res.json();
        setContent({
          companyInfo: data.companyInfo || {},
          services: data.services || [],
          faqs: data.faqs || [],
          brands: data.brands || [],
          gallery: data.gallery || [],
          reviews: data.reviews || [],
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
