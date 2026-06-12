import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectsApi } from '../services/api';
import { ChevronLeft, Award, Users, Calendar, MapPin, Zap } from 'lucide-react';

const CaseStudy = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await projectsApi.getById(id);
        setProject(res.data.data);
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!project) return <div className="h-screen flex items-center justify-center text-white">Project not found</div>;

  return (
    <div className="bg-navy-dark min-h-screen">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-navy-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-accent transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Back</span>
          </Link>
          <div className="text-center">
            <h1 className="text-sm font-black uppercase tracking-[2px] text-accent">{project.title}</h1>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative pt-20 h-[600px] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/40 via-navy-dark/20 to-navy-dark" />
        <img
          src={project.images?.[0] || 'https://via.placeholder.com/1200x600'}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Content Section */}
      <div className="bg-navy-dark relative -mt-20 z-10">
        <div className="container mx-auto px-8 lg:px-16 py-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[2px] bg-accent" />
              <span className="text-[0.65rem] font-black uppercase tracking-[4px] text-accent">Case Study</span>
            </div>

            <h1 className="font-display text-5xl lg:text-6xl text-white mb-6 leading-tight">
              {project.title}
            </h1>

            <p className="text-lg text-white/60 max-w-2xl mb-12 leading-relaxed">
              {project.description}
            </p>

            {/* Project Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Client</p>
                <p className="text-lg font-bold text-white">{project.client}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Category</p>
                <p className="text-lg font-bold text-white">{project.category}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Location</p>
                <p className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Year</p>
                <p className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {project.year}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Image Gallery */}
          {project.images && project.images.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-20 space-y-8"
            >
              <h2 className="text-3xl font-display text-white">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.images.slice(1).map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="rounded-2xl overflow-hidden hover:shadow-premium-hover transition-all duration-300"
                  >
                    <img
                      src={img}
                      alt={`${project.title} ${i + 1}`}
                      className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Project Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="rounded-2xl p-8 bg-white/5 border border-white/10 hover:border-accent/30 transition-all">
              <Award className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Excellence</h3>
              <p className="text-sm text-white/60">Industry-leading standards in construction and design execution</p>
            </div>
            <div className="rounded-2xl p-8 bg-white/5 border border-white/10 hover:border-accent/30 transition-all">
              <Users className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Collaboration</h3>
              <p className="text-sm text-white/60">Seamless coordination with architects, engineers, and stakeholders</p>
            </div>
            <div className="rounded-2xl p-8 bg-white/5 border border-white/10 hover:border-accent/30 transition-all">
              <Zap className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Innovation</h3>
              <p className="text-sm text-white/60">Cutting-edge MEP systems and sustainable design principles</p>
            </div>
          </motion.div>

          {/* Video (if exists) */}
          {project.videos && project.videos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-20"
            >
              <h2 className="text-3xl font-display text-white mb-8">Project Video</h2>
              <div className="relative rounded-2xl overflow-hidden aspect-video">
                <video
                  controls
                  className="w-full h-full bg-black"
                  poster={project.images?.[0]}
                >
                  <source src={project.videos[0]} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-20 rounded-2xl p-12 bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/30"
          >
            <h2 className="text-3xl font-display text-white mb-4">Ready to Transform Your Project?</h2>
            <p className="text-lg text-white/70 mb-8 max-w-2xl">
              Let's discuss how Craftech can bring your vision to life with the same excellence and precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="px-8 py-4 bg-accent text-white rounded-xl font-bold uppercase tracking-[2px] hover:bg-opacity-90 transition-all duration-300"
              >
                Start Your Project
              </a>
              <a
                href="/"
                className="px-8 py-4 border-2 border-accent text-accent rounded-xl font-bold uppercase tracking-[2px] hover:bg-accent hover:text-white transition-all duration-300"
              >
                View More Projects
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-white/5 py-12 text-center">
        <p className="text-white/50 text-sm">
          © 2026 Craftech Engineers. All projects showcase our commitment to excellence.
        </p>
      </div>
    </div>
  );
};

export default CaseStudy;
