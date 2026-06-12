import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FolderOpen, Settings, LogOut,
  Building2, Video, X, Users, MessageSquare,
  Image as ImageIcon, Home, Layers, Star, ChevronRight,
  Cpu, FileText, Briefcase
} from 'lucide-react';

const navGroups = [
  {
    label: 'Main',
    items: [
      { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/home', icon: Home, label: 'Hero & Stats' },
      { to: '/admin/process', icon: Layers, label: 'Process Blueprint' },
      { to: '/admin/features', icon: Star, label: 'Why Features' },
      { to: '/admin/pillars', icon: Cpu, label: 'Core Pillars' },
      { to: '/admin/services', icon: Briefcase, label: 'Domain Specialization' },
    ],
  },
  {
    label: 'Projects & Media',
    items: [
      { to: '/admin/projects', icon: FolderOpen, label: 'Projects' },
      { to: '/admin/media', icon: ImageIcon, label: 'Media Library' },
    ],
  },
  {
    label: 'Community',
    items: [
      { to: '/admin/testimonials', icon: FileText, label: 'Testimonials' },
      { to: '/admin/clients', icon: Building2, label: 'Clients' },
      { to: '/admin/leads', icon: MessageSquare, label: 'Leads' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default function Sidebar({ open, onClose }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const initials = admin?.name
    ? admin.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: 'rgba(4,14,31,0.85)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{
          background: 'linear-gradient(180deg, #061b36 0%, #040e1f 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #C41B1F 0%, #8b0000 100%)', boxShadow: '0 4px 12px rgba(196,27,31,0.4)' }}
            >
              <span className="text-xs font-bold text-white tracking-wider">CT</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">Craftech</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Engineering Admin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5 scrollbar-thin">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p
                className="px-3 mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em]"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ to, icon: Icon, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden
                      ${isActive ? 'active-nav-item' : 'inactive-nav-item'}`
                    }
                    style={({ isActive }) => isActive
                      ? { background: 'rgba(196,27,31,0.15)', color: '#fff', border: '1px solid rgba(196,27,31,0.3)' }
                      : { color: 'rgba(255,255,255,0.5)', border: '1px solid transparent' }
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                            style={{ background: '#C41B1F', boxShadow: '0 0 8px rgba(196,27,31,0.8)' }}
                          />
                        )}
                        <Icon
                          className="w-4 h-4 flex-shrink-0 transition-colors"
                          style={{ color: isActive ? '#C41B1F' : 'rgba(255,255,255,0.4)' }}
                        />
                        <span className="flex-1">{label}</span>
                        {isActive && (
                          <ChevronRight className="w-3 h-3 opacity-60" style={{ color: '#C41B1F' }} />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Info */}
        <div className="px-3 pb-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #0A2647 0%, #144272 100%)' }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{admin?.name || 'Admin'}</p>
              <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
            style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid transparent' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(196,27,31,0.12)';
              e.currentTarget.style.color = '#f87171';
              e.currentTarget.style.borderColor = 'rgba(196,27,31,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
