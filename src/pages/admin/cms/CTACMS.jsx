import React, { useState, useEffect } from 'react';
import { cmsApi } from '../../../services/api';
import toast from 'react-hot-toast';

const CTACMS = () => {
  const [ctas, setCtas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchCTAs();
  }, []);

  const fetchCTAs = async () => {
    try {
      const res = await cmsApi.getCTAs();
      setCtas(res.data.data || []);
    } catch (err) {
      console.error('Error fetching CTAs:', err);
      toast.error('Failed to load CTAs');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (cta) => {
    setEditingId(cta._id);
    setEditData(cta);
  };

  const saveEdit = async () => {
    try {
      await cmsApi.updateCTA(editingId, editData);
      toast.success('CTA updated successfully');
      setEditingId(null);
      fetchCTAs();
    } catch (err) {
      toast.error('Failed to update CTA');
    }
  };

  const handleInputChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const sections = ['hero', 'services', 'portfolio', 'testimonials', 'contact'];

  if (loading) return <div className="p-8 text-center text-white">Loading...</div>;

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h2 className="text-3xl font-black text-white mb-2">Context-Aware CTAs</h2>
        <p className="text-sm text-slate-400">Manage call-to-action messaging across different sections</p>
      </div>

      <div className="space-y-6">
        {sections.map(section => {
          const cta = ctas.find(c => c.sectionName === section);
          const isEditing = editingId === cta?._id;

          return (
            <div
              key={section}
              className="rounded-xl p-6 border border-slate-700 bg-slate-900/40"
            >
              <h3 className="text-lg font-bold text-white mb-6 capitalize">{section} Section</h3>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Primary Button Text</label>
                    <input
                      type="text"
                      value={editData.primaryText || ''}
                      onChange={(e) => handleInputChange('primaryText', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Primary Action</label>
                      <select
                        value={editData.primaryAction || 'scroll'}
                        onChange={(e) => handleInputChange('primaryAction', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
                      >
                        <option value="scroll">Scroll to Section</option>
                        <option value="modal">Open Modal</option>
                        <option value="link">External Link</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Primary URL</label>
                      <input
                        type="text"
                        value={editData.primaryUrl || ''}
                        onChange={(e) => handleInputChange('primaryUrl', e.target.value)}
                        placeholder="#contact or https://..."
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-slate-700 text-white rounded-lg font-bold text-sm hover:bg-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : cta ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-slate-400 mb-1">Primary Button</p>
                      <p className="text-white font-medium">{cta.primaryText}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Action: {cta.primaryAction} → {cta.primaryUrl}
                      </p>
                    </div>
                    <button
                      onClick={() => startEdit(cta)}
                      className="px-4 py-2 bg-slate-700 text-white rounded-lg font-bold text-sm hover:bg-slate-600"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">No CTA configured for this section</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CTACMS;
