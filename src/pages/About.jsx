import React from 'react';
import SEO from '../components/SEO';
import { useContent } from '../context/ContentContext';
import { Target, Award, Users } from 'lucide-react';

const About = () => {
  const { companyInfo } = useContent();

  return (
    <>
      <SEO 
        title="About Us" 
        description={`Learn more about ${companyInfo.name}, Bengaluru's premier IT solutions provider.`} 
      />
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">About Us</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Committed to delivering excellence in IT support and infrastructure.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-heading font-bold mb-6 text-slate-900 dark:text-white">Our Story</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {companyInfo.description}
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Founded by <strong>{companyInfo.owner}</strong>, we have built our reputation on trust, speed, and technical proficiency. Whether it's a minor laptop repair or a large-scale office networking project, our team handles every task with the utmost professionalism.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Target size={32} />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">Our Mission</h3>
              <p className="text-slate-600 dark:text-slate-400">To provide fast, reliable, and affordable IT solutions to every home and business in Bengaluru.</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">Our Quality</h3>
              <p className="text-slate-600 dark:text-slate-400">We never compromise on the quality of spare parts and the expertise of our service personnel.</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">Customer First</h3>
              <p className="text-slate-600 dark:text-slate-400">Your satisfaction is our primary metric for success. We build long-term relationships.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
