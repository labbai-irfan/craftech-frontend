import React, { useState, useEffect } from 'react';
import { cmsApi } from '../../../services/api';
import toast from 'react-hot-toast';
import { Loader2, Plus, Trash2, Edit2, Link as LinkIcon, X } from 'lucide-react';

export default function ClientsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    website: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    setLoading(true);
    cmsApi.getClients()
      .then(res => setItems(res.data.data))
      .catch(() => toast.error('Failed to load clients'))
      .finally(() => setLoading(false));
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        _id: item._id,
        name: item.name,
        logo: item.logo,
        website: item.website || ''
      });
      setIsEditing(true);
    } else {
      setFormData({
        name: '',
        logo: '',
        website: ''
      });
      setIsEditing(false);
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await cmsApi.updateClient(formData._id, formData);
        toast.success('Client updated');
      } else {
        await cmsApi.createClient(formData);
        toast.success('Client added');
      }
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this client?')) return;
    try {
      await cmsApi.deleteClient(id);
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
          <h2 className="text-xl font-bold text-white">Clients & Partners</h2>
          <p className="text-sm text-slate-400">Manage client logos and partnerships displayed on the site.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map(item => (
          <div key={item._id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 relative group text-center flex flex-col items-center justify-center min-h-[140px] transition-all hover:border-slate-600">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button onClick={() => handleOpenModal(item)} className="p-1.5 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => handleDelete(item._id)} className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            {item.logo ? (
              <img src={item.logo} alt={item.name} className="h-12 object-contain mb-3 filter grayscale hover:grayscale-0 transition-all duration-300" />
            ) : (
              <div className="h-12 w-full bg-slate-700/50 rounded mb-3 flex items-center justify-center text-xs text-slate-500">No Logo</div>
            )}
            <p className="text-sm font-medium text-white truncate w-full">{item.name}</p>
            {item.website && (
              <a href={item.website} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 flex items-center gap-1 mt-1 hover:underline">
                <LinkIcon className="w-2.5 h-2.5" /> Site
              </a>
            )}
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">{isEditing ? 'Edit Client' : 'Add New Client'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Client Name</label>
                <input
                  type="text" required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Logo URL</label>
                <input
                  type="text" required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  value={formData.logo}
                  onChange={e => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Website (Optional)</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
                  {isEditing ? 'Save Changes' : 'Add Client'}
                </button>
                <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all">
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
