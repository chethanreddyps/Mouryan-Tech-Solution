import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { useContent } from '../context/ContentContext';
import { generateServiceEnquiryLink } from '../utils/whatsapp';
import { ShieldCheck, Server, Zap } from 'lucide-react';

const getIcon = (name) => {
  switch (name) {
    case 'cctv': return <ShieldCheck className="w-10 h-10" />;
    case 'network': return <Zap className="w-10 h-10" />;
    default: return <Server className="w-10 h-10" />;
  }
};

const Services = () => {
  const { services, companyInfo } = useContent();

  return (
    <>
      <SEO 
        title="Our Services" 
        description="Explore our wide range of IT services including laptop repair, networking, CCTV installation, and data recovery in Bengaluru."
      />
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Our Services</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Comprehensive IT solutions tailored for your unique requirements.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-border hover:shadow-xl transition-all flex flex-col"
              >
                <div className="text-primary bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mb-6">
                  {getIcon(service.icon)}
                </div>
                <h2 className="text-2xl font-bold font-heading mb-4 text-slate-900 dark:text-white">{service.title}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow">
                  {service.description}
                </p>
                <a 
                  href={generateServiceEnquiryLink(service.title, companyInfo.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary text-white font-medium py-3 px-6 rounded-lg text-center hover:bg-primary-hover transition-colors"
                >
                  Enquire via WhatsApp
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
