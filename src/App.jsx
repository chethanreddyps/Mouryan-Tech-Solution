import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MainLayout from './layouts/MainLayout';
import { ContentProvider } from './context/ContentContext';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Loading fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <ContentProvider>
        <BrowserRouter>
          <ScrollToTop />
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route element={<ProtectedAdminRoute />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </MainLayout>
        </BrowserRouter>
      </ContentProvider>
    </HelmetProvider>
  );
}

export default App;
