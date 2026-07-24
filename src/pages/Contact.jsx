import React from 'react';
import SEO from '../components/SEO';
import ContactForm from '../components/ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Contact = () => {
  const { companyInfo } = useContent();
  return (
    <>
      <SEO 
        title="Contact Us" 
        description={`Get in touch with ${companyInfo.name}. We provide 24x7 emergency IT support in Bengaluru.`}
      />
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            We're here to help. Reach out for any inquiries or emergency support.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Details */}
            <div>
              <h2 className="text-3xl font-heading font-bold mb-8 text-slate-900 dark:text-white">Get In Touch</h2>
              
              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-5 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Visit Us</h3>
                    <p className="text-slate-600 dark:text-slate-400">{companyInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Call Us</h3>
                    <p className="text-slate-600 dark:text-slate-400">+91 {companyInfo.phone}</p>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">24×7 Emergency Support Available</p>
                  </div>
                </div>

                <div className="flex items-start gap-5 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Email Us</h3>
                    <p className="text-slate-600 dark:text-slate-400">{companyInfo.email}</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="w-full h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden border border-border relative">
                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                    <span>Google Maps Integration</span>
                  </div>
                </div>
                {/* Real integration would use an iframe here */}
                {/* <iframe src="..." width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy"></iframe> */}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
