import React, { useState, useEffect } from 'react';
import { cmsApi } from '../../../services/api';
import toast from 'react-hot-toast';
import { Loader2, Trash2, Mail, Phone, Calendar, CheckCircle } from 'lucide-react';

export default function LeadsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    setLoading(true);
    cmsApi.getLeads()
      .then(res => setItems(res.data.data))
      .catch(() => toast.error('Failed to load leads'))
      .finally(() => setLoading(false));
  };

  const handleToggleContacted = async (lead) => {
    try {
      await cmsApi.updateLead(lead._id, { contacted: !lead.contacted });
      toast.success(lead.contacted ? 'Marked as unread' : 'Marked as contacted');
      fetchItems();
    } catch {
      toast.error('Failed to update lead');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await cmsApi.deleteLead(id);
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
          <h2 className="text-xl font-bold text-white">Leads & Inquiries</h2>
          <p className="text-sm text-slate-400">Manage contact form submissions.</p>
        </div>
      </div>

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Details</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Type</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Message</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {items.map(lead => (
                <tr key={lead._id} className={`hover:bg-slate-800/40 transition-colors ${lead.contacted ? 'opacity-60' : ''}`}>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-white">{lead.name}</p>
                    <div className="flex flex-col gap-1 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {lead.email}</span>
                      <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {lead.phone}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400">
                      {lead.projectType || 'General'}
                    </span>
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    <p className="text-sm text-slate-300 line-clamp-2">{lead.message}</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(lead.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleContacted(lead)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                        lead.contacted ? 'bg-green-500/15 text-green-400 hover:bg-green-500/25' : 'bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25'
                      }`}
                    >
                      {lead.contacted ? <><CheckCircle className="w-3 h-3"/> Contacted</> : 'Pending'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => handleDelete(lead._id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-slate-400">No leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
