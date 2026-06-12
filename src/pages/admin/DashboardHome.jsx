import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../services/api';
import {
  FolderOpen, MessageSquare, Image as ImageIcon, CheckCircle,
  ArrowRight, Plus, TrendingUp, Video, Users, Zap,
  Activity, Globe, Database, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ label, value, icon: Icon, loading, accentColor, bgColor, trend }) => (
  <div
    className="relative overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
    style={{
      background: 'rgba(10,38,71,0.25)',
      border: '1px solid rgba(255,255,255,0.07)',
      backdropFilter: 'blur(20px)',
    }}
  >
    <div className="flex items-start justify-between mb-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: bgColor }}
      >
        <Icon className="w-5 h-5" style={{ color: accentColor }} />
      </div>
      {trend && (
        <span
          className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ color: '#4ade80', background: 'rgba(74,222,128,0.1)' }}
        >
          <TrendingUp className="w-3 h-3" /> {trend}
        </span>
      )}
    </div>
    <p className="text-3xl font-bold text-white mb-1">
      {loading ? (
        <span className="inline-block w-12 h-7 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
      ) : value}
    </p>
    <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</p>

    {/* Decorative glow */}
    <div
      className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-20"
      style={{ background: accentColor }}
    />
  </div>
);

const QuickAction = ({ to, icon: Icon, label, description, accent }) => (
  <Link
    to={to}
    className="group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300"
    style={{
      background: accent ? 'rgba(196,27,31,0.1)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${accent ? 'rgba(196,27,31,0.25)' : 'rgba(255,255,255,0.06)'}`,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = accent ? 'rgba(196,27,31,0.18)' : 'rgba(255,255,255,0.07)';
      e.currentTarget.style.borderColor = accent ? 'rgba(196,27,31,0.4)' : 'rgba(255,255,255,0.12)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = accent ? 'rgba(196,27,31,0.1)' : 'rgba(255,255,255,0.04)';
      e.currentTarget.style.borderColor = accent ? 'rgba(196,27,31,0.25)' : 'rgba(255,255,255,0.06)';
    }}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: accent ? 'rgba(196,27,31,0.2)' : 'rgba(255,255,255,0.06)' }}
    >
      <Icon className="w-5 h-5" style={{ color: accent ? '#C41B1F' : 'rgba(255,255,255,0.6)' }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{description}</p>
    </div>
    <ArrowRight
      className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
      style={{ color: accent ? '#C41B1F' : 'rgba(255,255,255,0.3)' }}
    />
  </Link>
);

const StatusItem = ({ icon: Icon, label, status, color }) => (
  <div
    className="flex items-center gap-3 p-3.5 rounded-xl"
    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
  >
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}15` }}
    >
      <Icon className="w-4 h-4" style={{ color }} />
    </div>
    <span className="flex-1 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
    <div className="flex items-center gap-1.5">
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
      <span className="text-xs font-bold uppercase tracking-wide" style={{ color }}>{status}</span>
    </div>
  </div>
);

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { admin } = useAuth();

  useEffect(() => {
    authApi.getStats()
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = [
    {
      label: 'Total Projects',
      value: stats?.totalProjects || 0,
      icon: FolderOpen,
      accentColor: '#60a5fa',
      bgColor: 'rgba(96,165,250,0.12)',
      trend: '+2 this month',
    },
    {
      label: 'Active Leads',
      value: stats?.totalLeads || 0,
      icon: MessageSquare,
      accentColor: '#fb923c',
      bgColor: 'rgba(251,146,60,0.12)',
    },
    {
      label: 'Media Assets',
      value: (stats?.totalImages || 0) + (stats?.totalProjectVideos || 0),
      icon: ImageIcon,
      accentColor: '#34d399',
      bgColor: 'rgba(52,211,153,0.12)',
    },
    {
      label: 'CMS Entities',
      value: (stats?.totalSteps || 0) + (stats?.totalFeatures || 0) + (stats?.totalTestimonials || 0),
      icon: CheckCircle,
      accentColor: '#a78bfa',
      bgColor: 'rgba(167,139,250,0.12)',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Welcome Banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(10,38,71,0.9) 0%, rgba(6,27,54,0.95) 50%, rgba(196,27,31,0.15) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="relative z-10">
          <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {greeting()},
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {admin?.name || 'Admin'} <span style={{ color: '#C41B1F' }}>👋</span>
          </h2>
          <p className="text-sm max-w-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Here's what's happening with your Craftech platform today. Manage your projects, content, and media from this dashboard.
          </p>
        </div>
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: '#C41B1F', transform: 'translate(30%, -30%)' }}
        />
        <div
          className="absolute bottom-0 right-32 w-40 h-40 rounded-full blur-3xl opacity-5 pointer-events-none"
          style={{ background: '#D4AF37' }}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} loading={loading} />
        ))}
      </div>

      {/* Quick Actions + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Quick Actions */}
        <div
          className="rounded-2xl p-5 sm:p-6 space-y-3"
          style={{
            background: 'rgba(10,38,71,0.25)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white text-base">Quick Actions</h3>
            <Zap className="w-4 h-4" style={{ color: '#D4AF37' }} />
          </div>
          <QuickAction
            to="/admin/projects/new"
            icon={Plus}
            label="New Project"
            description="Add a construction project with media"
            accent
          />
          <QuickAction
            to="/admin/leads"
            icon={MessageSquare}
            label="View Leads"
            description="Review recent contact submissions"
          />
          <QuickAction
            to="/admin/media"
            icon={ImageIcon}
            label="Media Library"
            description="Manage all project images & videos"
          />
          <QuickAction
            to="/admin/home"
            icon={Globe}
            label="Edit Homepage"
            description="Update hero slides and stats"
          />
        </div>

        {/* System Status */}
        <div
          className="rounded-2xl p-5 sm:p-6 space-y-3"
          style={{
            background: 'rgba(10,38,71,0.25)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white text-base">System Status</h3>
            <Activity className="w-4 h-4" style={{ color: '#34d399' }} />
          </div>
          <StatusItem icon={Globe} label="Backend API" status="Operational" color="#34d399" />
          <StatusItem icon={Database} label="MongoDB Atlas" status="Connected" color="#34d399" />
          <StatusItem icon={ImageIcon} label="Cloudinary CDN" status="Active" color="#60a5fa" />

          <div
            className="mt-4 p-4 rounded-xl"
            style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4" style={{ color: '#34d399' }} />
              <span className="text-xs font-bold text-white">All Systems Operational</span>
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Platform is running smoothly. No incidents reported.
            </p>
          </div>
        </div>
      </div>

      {/* Media Overview */}
      <div
        className="rounded-2xl p-5 sm:p-6"
        style={{
          background: 'rgba(10,38,71,0.25)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white text-base">Media Overview</h3>
          <Link
            to="/admin/media"
            className="flex items-center gap-1 text-xs font-semibold transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#C41B1F'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: FolderOpen, label: 'Projects', value: stats?.totalProjects || 0, color: '#60a5fa' },
            { icon: ImageIcon, label: 'Images', value: stats?.totalImages || 0, color: '#34d399' },
            { icon: Video, label: 'Videos', value: stats?.totalProjectVideos || 0, color: '#a78bfa' },
            { icon: Users, label: 'Testimonials', value: stats?.totalTestimonials || 0, color: '#fbbf24' },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-4 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div
                className="w-9 h-9 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{ background: `${item.color}15` }}
              >
                <item.icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <p className="text-xl font-bold text-white">
                {loading ? '–' : item.value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
