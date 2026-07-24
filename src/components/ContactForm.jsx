import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { Send, Image as ImageIcon } from 'lucide-react';

const ContactForm = () => {
  const { services, companyInfo } = useContent();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  });
  const [hasImages, setHasImages] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setHasImages(true);
    } else {
      setHasImages(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let textMessage = `Hello Mouryan Tech Solutions,\n\n`;
    textMessage += `*Name:* ${formData.name}\n`;
    textMessage += `*Phone:* ${formData.phone}\n`;
    if (formData.email) textMessage += `*Email:* ${formData.email}\n`;
    if (formData.service) textMessage += `*Service Required:* ${formData.service}\n`;
    textMessage += `*Message:* ${formData.message}\n`;

    if (hasImages) {
      alert("Note: Images cannot be automatically attached to WhatsApp web links. Please manually attach your selected images once WhatsApp opens.");
    }

    const waLink = generateWhatsAppLink(textMessage, companyInfo.whatsapp);
    window.open(waLink, '_blank');
    
    // Optional reset
    // setFormData({ name: '', phone: '', email: '', service: '', message: '' });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-border p-8">
      <h3 className="text-2xl font-heading font-bold mb-6">Send an Enquiry</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name *</label>
            <input 
              required
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number *</label>
            <input 
              required
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              placeholder="Your 10-digit number"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email (Optional)</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Service Required</label>
          <select 
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
          >
            <option value="">Select a service (Optional)</option>
            {services.map(s => (
              <option key={s.id} value={s.title}>{s.title}</option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Message *</label>
          <textarea 
            required
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none"
            placeholder="How can we help you?"
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
            <ImageIcon size={18} />
            <span>Upload Images (Optional)</span>
          </label>
          <input 
            type="file" 
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
          />
          {hasImages && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              * Images cannot be sent automatically. You'll need to attach them in WhatsApp.
            </p>
          )}
        </div>

        <button 
          type="submit"
          className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow"
        >
          <Send size={18} />
          <span>Send Enquiry via WhatsApp</span>
        </button>
        
      </form>
    </div>
  );
};

export default ContactForm;
