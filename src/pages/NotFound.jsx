import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <>
      <SEO title="404 - Page Not Found" description="The page you are looking for does not exist." />
      <section className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-20 px-4">
        <div className="text-center max-w-lg mx-auto">
          <div className="text-9xl font-heading font-black text-slate-200 dark:text-slate-800 mb-6">404</div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-4">Page Not Found</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
            Sorry, we couldn't find the page you're looking for. It might have been removed or the link might be broken.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary-hover transition-colors shadow-sm hover:shadow"
          >
            <Home size={20} />
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
};

export default NotFound;
