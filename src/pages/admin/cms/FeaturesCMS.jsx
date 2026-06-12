import React, { useState, useEffect } from 'react';
import { cmsApi } from '../../../services/api';
import toast from 'react-hot-toast';
import { Save, Loader2, Plus, Trash2, Edit2, X } from 'lucide-react';

export default function FeaturesCMS() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState({ icon: '', title: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const res = await cmsApi.getWhyFeatures();
      setFeatures(res.data.data);
    } catch (err) {
      toast.error('Failed to load features');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (feature = { icon: '', title: '', description: '' }) => {
    setCurrentFeature(feature);
    setIsEditing(!!feature._id);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await cmsApi.updateWhyFeature(currentFeature._id, currentFeature);
        toast.success('Feature updated');
      } else {
        await cmsApi.createWhyFeature(currentFeature);
        toast.success('Feature created');
      }
      setModalOpen(false);
      fetchFeatures();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feature?')) return;
    try {
      await cmsApi.deleteWhyFeature(id);
      toast.success('Feature deleted');
      fetchFeatures();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-slate-500" /></div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-white">Strategic Features</h2>
          <p className="text-sm text-slate-400">Manage the 'Why Choose Us' features.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Feature
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => (
          <div key={feature._id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 flex justify-between items-start group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <i className={`fa-solid ${feature.icon || 'fa-star'}`} />
              </div>
              <div>
                <h3 className="font-bold text-white">{feature.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{feature.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => handleOpenModal(feature)} className="p-1.5 text-slate-400 hover:text-white transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(feature._id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">{isEditing ? 'Edit Feature' : 'Add New Feature'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Icon (FontAwesome Class, e.g. fa-gear)</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-sm"
                  placeholder="fa-gear"
                  value={currentFeature.icon}
                  onChange={e => setCurrentFeature({ ...currentFeature, icon: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  value={currentFeature.title}
                  onChange={e => setCurrentFeature({ ...currentFeature, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Description</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  value={currentFeature.description}
                  onChange={e => setCurrentFeature({ ...currentFeature, description: e.target.value })}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
                >
                  {isEditing ? 'Save Changes' : 'Create Feature'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
