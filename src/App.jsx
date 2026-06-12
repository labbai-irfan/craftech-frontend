import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CMSProvider } from './context/CMSContext';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import CaseStudy from './pages/CaseStudy';
import Login from './pages/admin/Login';
import AdminLayout from './components/admin/Layout';

// Lazy load admin components (code splitting)
const DashboardHome = lazy(() => import('./pages/admin/DashboardHome'));
const ProjectsList = lazy(() => import('./pages/admin/projects/ProjectsList'));
const ProjectForm = lazy(() => import('./pages/admin/projects/ProjectForm'));
const MediaManager = lazy(() => import('./pages/admin/MediaManager'));

// Lazy load CMS pages
const HomeCMS = lazy(() => import('./pages/admin/cms/HomeCMS'));
const ProcessCMS = lazy(() => import('./pages/admin/cms/ProcessCMS'));
const FeaturesCMS = lazy(() => import('./pages/admin/cms/FeaturesCMS'));
const PillarsCMS = lazy(() => import('./pages/admin/cms/PillarsCMS'));
const ServicesCMS = lazy(() => import('./pages/admin/cms/ServicesCMS'));
const TestimonialsList = lazy(() => import('./pages/admin/cms/TestimonialsList'));
const ClientsList = lazy(() => import('./pages/admin/cms/ClientsList'));
const LeadsCRM = lazy(() => import('./pages/admin/LeadsCRM'));
const Settings = lazy(() => import('./pages/admin/cms/Settings'));
const CTACMS = lazy(() => import('./pages/admin/cms/CTACMS'));

// Loading fallback component
const AdminLoading = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-900">
    <div className="animate-spin">
      <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full" />
    </div>
  </div>
);

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return null;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CMSProvider>
          <Toaster position="top-right" toastOptions={{
            style: { background: '#1e293b', color: '#fff' },
          }} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/case-study/:id" element={<CaseStudy />} />
          
          {/* Admin Auth */}
          <Route path="/admin/login" element={<Login />} />
          
          {/* Admin Dashboard */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={
              <Suspense fallback={<AdminLoading />}>
                <DashboardHome />
              </Suspense>
            } />
            <Route path="home" element={
              <Suspense fallback={<AdminLoading />}>
                <HomeCMS />
              </Suspense>
            } />
            <Route path="process" element={
              <Suspense fallback={<AdminLoading />}>
                <ProcessCMS />
              </Suspense>
            } />
            <Route path="features" element={
              <Suspense fallback={<AdminLoading />}>
                <FeaturesCMS />
              </Suspense>
            } />
            <Route path="pillars" element={
              <Suspense fallback={<AdminLoading />}>
                <PillarsCMS />
              </Suspense>
            } />
            <Route path="services" element={
              <Suspense fallback={<AdminLoading />}>
                <ServicesCMS />
              </Suspense>
            } />
            <Route path="projects" element={
              <Suspense fallback={<AdminLoading />}>
                <ProjectsList />
              </Suspense>
            } />
            <Route path="projects/new" element={
              <Suspense fallback={<AdminLoading />}>
                <ProjectForm />
              </Suspense>
            } />
            <Route path="projects/:id" element={
              <Suspense fallback={<AdminLoading />}>
                <ProjectForm />
              </Suspense>
            } />
            <Route path="media" element={
              <Suspense fallback={<AdminLoading />}>
                <MediaManager />
              </Suspense>
            } />
            <Route path="testimonials" element={
              <Suspense fallback={<AdminLoading />}>
                <TestimonialsList />
              </Suspense>
            } />
            <Route path="clients" element={
              <Suspense fallback={<AdminLoading />}>
                <ClientsList />
              </Suspense>
            } />
            <Route path="leads" element={
              <Suspense fallback={<AdminLoading />}>
                <LeadsCRM />
              </Suspense>
            } />
            <Route path="ctas" element={
              <Suspense fallback={<AdminLoading />}>
                <CTACMS />
              </Suspense>
            } />
            <Route path="settings" element={
              <Suspense fallback={<AdminLoading />}>
                <Settings />
              </Suspense>
            } />
          </Route>
  
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </CMSProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
