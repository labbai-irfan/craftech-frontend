import React, { useState, useEffect } from 'react';
import { Menu, Bell, ChevronRight, Home } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const breadcrumbMap = {
  '/admin': [{ label: 'Dashboard', href: '/admin' }],
  '/admin/home': [{ label: 'Dashboard', href: '/admin' }, { label: 'Hero & Stats' }],
  '/admin/process': [{ label: 'Dashboard', href: '/admin' }, { label: 'Process Blueprint' }],
  '/admin/features': [{ label: 'Dashboard', href: '/admin' }, { label: 'Why Features' }],
  '/admin/pillars': [{ label: 'Dashboard', href: '/admin' }, { label: 'Core Pillars' }],
  '/admin/services': [{ label: 'Dashboard', href: '/admin' }, { label: 'Domain Specialization' }],
  '/admin/projects': [{ label: 'Dashboard', href: '/admin' }, { label: 'Projects' }],
  '/admin/projects/new': [{ label: 'Dashboard', href: '/admin' }, { label: 'Projects', href: '/admin/projects' }, { label: 'New Project' }],
  '/admin/media': [{ label: 'Dashboard', href: '/admin' }, { label: 'Media Library' }],
  '/admin/testimonials': [{ label: 'Dashboard', href: '/admin' }, { label: 'Testimonials' }],
  '/admin/clients': [{ label: 'Dashboard', href: '/admin' }, { label: 'Clients' }],
  '/admin/leads': [{ label: 'Dashboard', href: '/admin' }, { label: 'Leads' }],
  '/admin/settings': [{ label: 'Dashboard', href: '/admin' }, { label: 'Settings' }],
};

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const { admin } = useAuth();
  const [dateStr, setDateStr] = useState(formatDate());

  useEffect(() => {
    const t = setInterval(() => setDateStr(formatDate()), 60000);
    return () => clearInterval(t);
  }, []);

  const crumbs = pathname.startsWith('/admin/projects/') && pathname !== '/admin/projects/new'
    ? [{ label: 'Dashboard', href: '/admin' }, { label: 'Projects', href: '/admin/projects' }, { label: 'Edit Project' }]
    : (breadcrumbMap[pathname] || [{ label: 'Dashboard', href: '/admin' }, { label: 'Admin' }]);

  const pageTitle = crumbs[crumbs.length - 1]?.label || 'Admin';
  const initials = admin?.name
    ? admin.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  return (
    <header
      className="sticky top-0 z-10 flex items-center gap-4 px-4 sm:px-6 py-3.5"
      style={{
        background: 'rgba(4, 14, 31, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb */}
      <div className="flex-1 flex items-center gap-1.5 min-w-0">
        <Home className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }} />}
            {crumb.href && i < crumbs.length - 1 ? (
              <Link
                to={crumb.href}
                className="text-xs truncate transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-xs font-semibold text-white truncate">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Date — hidden on small screens */}
        <span
          className="hidden sm:block text-xs px-3 py-1.5 rounded-lg"
          style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {dateStr}
        </span>

        {/* Notification bell */}
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors relative"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: '#C41B1F', boxShadow: '0 0 6px rgba(196,27,31,0.8)' }}
          />
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white select-none cursor-default"
          style={{
            background: 'linear-gradient(135deg, #0A2647 0%, #144272 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          title={admin?.name}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
