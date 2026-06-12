import React, { useState, useEffect } from 'react';
import { contentApi } from '../../../services/api';
import toast from 'react-hot-toast';
import { Loader2, Plus, Trash2, Edit2, X, Info } from 'lucide-react';

export default function PillarsCMS() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    order: 0
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    setLoading(true);
    contentApi.getPillars()
      .then(res => setItems(res.data.data))
      .catch(() => toast.error('Failed to load pillars'))
      .finally(() => setLoading(false));
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        _id: item._id,
        title: item.title,
        description: item.description,
        icon: item.icon,
        order: item.order
      });
      setIsEditing(true);
    } else {
      setFormData({
        title: '',
        description: '',
        icon: '',
        order: items.length
      });
      setIsEditing(false);
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await contentApi.updatePillar(formData._id, formData);
        toast.success('Pillar updated');
      } else {
        await contentApi.createPillar(formData);
        toast.success('Pillar added');
      }
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pillar?')) return;
    try {
      await contentApi.deletePillar(id);
      toast.success('Deleted successfully');
      fetchItems();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-slate-500" /></div>;

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Core Pillars</h2>
          <p className="text-sm text-slate-400">Manage the fundamental values of Craftech.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Pillar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div key={item._id} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 relative group hover:border-indigo-500/50 transition-all">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={() => handleOpenModal(item)} className="p-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30"><Trash2 className="w-4 h-4" /></button>
            </div>

            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-6 text-2xl font-black">
              {item.icon ? <i className={`fa-solid ${item.icon}`} /> : <Info className="w-6 h-6" />}
            </div>

            <h4 className="text-lg font-bold text-white mb-3">{item.title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{item.description}</p>
            
            <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Order: {item.order}</span>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <h3 className="text-lg font-bold text-white">{isEditing ? 'Edit Pillar' : 'Add New Pillar'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-full transition-colors"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pillar Title</label>
                  <input
                    type="text" required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-indigo-500 transition-colors"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">FontAwesome Icon</label>
                  <input
                    type="text" required
                    placeholder="fa-shield-halved"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-indigo-500 transition-colors"
                    value={formData.icon}
                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                <textarea
                  required rows={4}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white resize-none focus:border-indigo-500 transition-colors"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Display Order</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-indigo-500 transition-colors"
                  value={formData.order}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-indigo-500/20">
                  {isEditing ? 'Update Pillar' : 'Add Pillar'}
                </button>
                <button type="button" onClick={() => setModalOpen(false)} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl transition-all">
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
