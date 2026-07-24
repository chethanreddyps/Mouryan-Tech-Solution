import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Image as ImageIcon, Users, LogOut, Loader2, Save, Upload, Trash2, Star } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { clearAdminAuth, getAdminAuthHeaders } from '../../utils/adminAuth';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const { refreshContent } = useContent();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const sessionResponse = await fetch(`${API}/api/admin/session`, {
          headers: getAdminAuthHeaders()
        });
        if (!sessionResponse.ok) {
          clearAdminAuth();
          navigate('/admin', { replace: true });
          return;
        }

        await fetchData();
      } catch {
        clearAdminAuth();
        navigate('/admin', { replace: true });
      }
    };

    initializeDashboard();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/api/content`);
      if (res.status === 401) {
        clearAdminAuth();
        navigate('/admin', { replace: true });
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${API}/api/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAdminAuthHeaders() },
        body: JSON.stringify({ data })
      });
      if (res.status === 401) {
        clearAdminAuth();
        navigate('/admin', { replace: true });
        return;
      }
      const result = await res.json();
      if (result.success) {
        await refreshContent();
        setMessage('Saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(result.error || 'Failed to save');
      }
    } catch (err) {
      setMessage('Error connecting to server');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearAdminAuth();
    navigate('/admin');
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="admin-panel min-h-screen flex">
      {/* Sidebar */}
      <div className="admin-sidebar w-64 border-r border-border p-6 flex flex-col h-screen fixed">
        <h2 className="text-xl font-bold font-heading mb-8">Admin Panel</h2>
        
        <nav className="space-y-2 flex-grow">
          <button 
            onClick={() => setActiveTab('company')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'company' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Settings size={20} /> Company Info
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'services' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Users size={20} /> Services
          </button>
          <button 
            onClick={() => setActiveTab('faqs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'faqs' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Users size={20} /> FAQs
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'gallery' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <ImageIcon size={20} /> Gallery
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'reviews' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Star size={20} /> Reviews
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mt-auto transition-colors"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-heading capitalize">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</h1>
            <div className="flex items-center gap-4">
              {message && <span className="text-sm font-medium text-green-600">{message}</span>}
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
            </div>
          </div>

          <div className="admin-card rounded-2xl shadow-sm border border-border p-8">
            
            {activeTab === 'company' && data.companyInfo && (
              <div className="space-y-4">
                {Object.keys(data.companyInfo).map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                    {key === 'description' ? (
                      <textarea 
                        rows={4}
                        value={data.companyInfo[key]} 
                        onChange={(e) => setData({...data, companyInfo: {...data.companyInfo, [key]: e.target.value}})}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <input 
                        type="text" 
                        value={data.companyInfo[key]} 
                        onChange={(e) => setData({...data, companyInfo: {...data.companyInfo, [key]: e.target.value}})}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <p className="text-slate-500 mb-6">Edit your website services here. (Note: Icons must match valid Lucide icon names currently implemented).</p>
                <div className="space-y-6">
                  {data.services.map((service, index) => (
                    <div key={service.id} className="p-4 border border-border rounded-lg space-y-3">
                      <input 
                        type="text" 
                        value={service.title} 
                        onChange={(e) => {
                          const newServices = [...data.services];
                          newServices[index].title = e.target.value;
                          setData({...data, services: newServices});
                        }}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-slate-50 font-bold"
                        placeholder="Title"
                      />
                      <textarea 
                        value={service.description} 
                        onChange={(e) => {
                          const newServices = [...data.services];
                          newServices[index].description = e.target.value;
                          setData({...data, services: newServices});
                        }}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-slate-50"
                        placeholder="Description"
                      />
                      <input 
                        type="text" 
                        value={service.icon} 
                        onChange={(e) => {
                          const newServices = [...data.services];
                          newServices[index].icon = e.target.value;
                          setData({...data, services: newServices});
                        }}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-slate-50 text-sm"
                        placeholder="Icon Name (e.g. laptop, printer, cctv)"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'faqs' && (
              <div>
                <button 
                  onClick={() => setData({...data, faqs: [...data.faqs, { id: Date.now().toString(), question: 'New Question?', answer: 'Answer here.' }]})}
                  className="mb-6 bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                >
                  + Add FAQ
                </button>
                <div className="space-y-6">
                  {data.faqs.map((faq, index) => (
                    <div key={faq.id} className="p-4 border border-border rounded-lg space-y-3 relative group">
                      <button 
                        onClick={() => {
                          const newFaqs = data.faqs.filter((_, i) => i !== index);
                          setData({...data, faqs: newFaqs});
                        }}
                        className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium"
                      >
                        Remove
                      </button>
                      <input 
                        type="text" 
                        value={faq.question} 
                        onChange={(e) => {
                          const newFaqs = [...data.faqs];
                          newFaqs[index].question = e.target.value;
                          setData({...data, faqs: newFaqs});
                        }}
                        className="w-full pr-20 px-4 py-2 border border-border rounded-lg bg-slate-50 font-bold"
                        placeholder="Question"
                      />
                      <textarea 
                        value={faq.answer} 
                        onChange={(e) => {
                          const newFaqs = [...data.faqs];
                          newFaqs[index].answer = e.target.value;
                          setData({...data, faqs: newFaqs});
                        }}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-slate-50"
                        placeholder="Answer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div>
                <div className="mb-6 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-5">
                  <label className="flex cursor-pointer items-center justify-center gap-2 text-primary font-medium">
                    <Upload size={18} /> Upload gallery image
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('image', file);
                        try {
                          const response = await fetch(`${API}/api/upload`, {
                            method: 'POST',
                            body: formData,
                            headers: getAdminAuthHeaders()
                          });
                          if (response.status === 401) {
                            clearAdminAuth();
                            navigate('/admin', { replace: true });
                            return;
                          }
                          const result = await response.json();
                          if (!response.ok) throw new Error(result.error);
                          setData({ ...data, gallery: [...(data.gallery || []), { id: Date.now().toString(), url: result.url, alt: '', caption: '' }] });
                          setMessage('Image uploaded. Click Save Changes to publish it.');
                        } catch (error) {
                          setMessage(error.message || 'Image upload failed');
                        } finally {
                          event.target.value = '';
                        }
                      }}
                    />
                  </label>
                  <p className="mt-2 text-center text-xs text-slate-500">PNG, JPG, or WebP up to 5 MB.</p>
                </div>
                {!data.gallery?.length && <p className="text-slate-500">No gallery images yet.</p>}
                <div className="grid gap-5 md:grid-cols-2">
                  {(data.gallery || []).map((image, index) => (
                    <div key={image.id || image.url} className="overflow-hidden rounded-xl border border-border">
                      <img src={image.url} alt={image.alt || 'Gallery preview'} className="h-44 w-full object-cover" />
                      <div className="space-y-3 p-4">
                        <input
                          type="text"
                          value={image.alt || ''}
                          onChange={(event) => {
                            const gallery = [...data.gallery];
                            gallery[index] = { ...gallery[index], alt: event.target.value };
                            setData({ ...data, gallery });
                          }}
                          className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm"
                          placeholder="Image description"
                        />
                        <input
                          type="text"
                          value={image.caption || ''}
                          onChange={(event) => {
                            const gallery = [...data.gallery];
                            gallery[index] = { ...gallery[index], caption: event.target.value };
                            setData({ ...data, gallery });
                          }}
                          className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm"
                          placeholder="Optional caption"
                        />
                        <button
                          onClick={() => setData({ ...data, gallery: data.gallery.filter((_, itemIndex) => itemIndex !== index) })}
                          className="flex items-center gap-2 text-sm font-medium text-red-500"
                        >
                          <Trash2 size={16} /> Remove image
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <button
                  onClick={() => setData({
                    ...data,
                    reviews: [...(data.reviews || []), { id: Date.now().toString(), name: '', rating: 5, service: '', comment: '' }]
                  })}
                  className="mb-6 bg-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                >
                  + Add review
                </button>
                {!data.reviews?.length && <p className="text-slate-500">No customer reviews yet.</p>}
                <div className="space-y-5">
                  {(data.reviews || []).map((review, index) => (
                    <div key={review.id} className="relative rounded-xl border border-border p-5 space-y-3">
                      <button
                        onClick={() => setData({ ...data, reviews: data.reviews.filter((_, itemIndex) => itemIndex !== index) })}
                        className="absolute right-5 top-5 flex items-center gap-2 text-sm font-medium text-red-500"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                      <div className="grid gap-3 sm:grid-cols-2 pr-24">
                        <input
                          type="text"
                          value={review.name}
                          onChange={(event) => {
                            const reviews = [...data.reviews];
                            reviews[index] = { ...reviews[index], name: event.target.value };
                            setData({ ...data, reviews });
                          }}
                          className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2"
                          placeholder="Customer name"
                        />
                        <input
                          type="text"
                          value={review.service || ''}
                          onChange={(event) => {
                            const reviews = [...data.reviews];
                            reviews[index] = { ...reviews[index], service: event.target.value };
                            setData({ ...data, reviews });
                          }}
                          className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2"
                          placeholder="Service received"
                        />
                      </div>
                      <label className="block text-sm font-medium">
                        Rating
                        <select
                          value={review.rating || 5}
                          onChange={(event) => {
                            const reviews = [...data.reviews];
                            reviews[index] = { ...reviews[index], rating: Number(event.target.value) };
                            setData({ ...data, reviews });
                          }}
                          className="ml-3 rounded-lg border border-border bg-slate-50 px-3 py-2"
                        >
                          {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} star{rating === 1 ? '' : 's'}</option>)}
                        </select>
                      </label>
                      <textarea
                        rows={3}
                        value={review.comment}
                        onChange={(event) => {
                          const reviews = [...data.reviews];
                          reviews[index] = { ...reviews[index], comment: event.target.value };
                          setData({ ...data, reviews });
                        }}
                        className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2"
                        placeholder="Customer review"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
