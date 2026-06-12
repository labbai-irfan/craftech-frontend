import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { projectsApi } from '../services/api';
import { copy } from '../content/copy';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LazyImage from '../components/common/LazyImage';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowUpRight } from 'lucide-react';
import { getMetaTags, getCanonicalUrl, generateBreadcrumbSchema } from '../utils/seo';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'all',
    'Structural Evolution',
    'Luxury Fit-Out',
    'Architecture & MEP',
    'Building Construction',
    'Interior Fit Outs',
    'MEP Execution',
    'Project Management',
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await projectsApi.getAll({ limit: 100 });
      const allProjects = res.data.data || [];
      setProjects(allProjects);
      setFilteredProjects(allProjects);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = projects;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  }, [selectedCategory, searchTerm, projects]);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' },
  ];

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Projects | Craftech Engineers Portfolio</title>
        <meta name="description" content="Explore our portfolio of premium construction, MEP execution, and interior fit-out projects across Mumbai." />
        <link rel="canonical" href={getCanonicalUrl('/projects')} />
      </Helmet>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-navy to-navy-dark relative overflow-hidden">
        <div className="container mx-auto px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[2px] bg-accent" />
              <span className="text-xs font-black uppercase tracking-widest text-accent">Our Work</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              {copy.portfolio.headline}
            </h1>
            <p className="text-lg text-white/70 max-w-xl">
              {copy.portfolio.subheading}
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/10 blur-3xl opacity-30 pointer-events-none" />
      </section>

      {/* Filters */}
      <section className="py-16 border-b border-gray-200">
        <div className="container mx-auto px-8">
          <div className="space-y-8">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <input
                type="text"
                placeholder="Search projects by name, client, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
              />
            </motion.div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-navy text-white shadow-lg'
                      : 'bg-light text-navy border-2 border-navy hover:bg-navy hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </motion.div>

            {/* Results count */}
            <div className="text-sm text-mid font-medium">
              Showing {filteredProjects.length} of {projects.length} projects
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          {loading ? (
            <div className="flex justify-center items-center py-40">
              <Loader2 className="w-8 h-8 animate-spin text-navy" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-40">
              <p className="text-xl text-mid">No projects found matching your criteria.</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, i) => (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="group"
                  >
                    <Link
                      to={`/case-study/${project._id}`}
                      className="block h-full rounded-2xl overflow-hidden hover-lift"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                        <LazyImage
                          src={project.thumbnail || project.images?.[0]}
                          alt={project.title}
                          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                          priority={i < 6}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Card Info */}
                      <div className="p-6 bg-white group-hover:bg-light transition-colors">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <p className="text-xs font-bold text-navy/50 uppercase tracking-wider mb-1">
                              {project.category}
                            </p>
                            <h3 className="text-lg font-black text-navy line-clamp-2">
                              {project.title}
                            </h3>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent group-hover:bg-accent group-hover:text-white transition-all">
                            <ArrowUpRight className="w-5 h-5" />
                          </div>
                        </div>

                        <p className="text-sm text-mid mb-4 line-clamp-2">
                          {project.client}
                        </p>

                        <div className="flex items-center justify-between text-xs font-bold text-navy/50 uppercase tracking-wider">
                          <span>{project.location}</span>
                          <span>{project.year}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy via-navy-dark to-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>

        <div className="container mx-auto px-8 relative z-10 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-white/70 mb-10">
              Let's discuss how we can transform your vision into reality with the same precision and excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#contact"
                className="px-10 py-4 bg-accent text-white rounded-xl font-bold uppercase tracking-[2px] hover:shadow-premium transition-all duration-300"
              >
                Schedule Consultation
              </a>
              <a
                href="https://wa.me/919324877493?text=Hi Craftech, I'd like to discuss a project"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 border-2 border-white text-white rounded-xl font-bold uppercase tracking-[2px] hover:bg-white hover:text-navy transition-all duration-300"
              >
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Schema */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema(breadcrumbs))}
        </script>
      </Helmet>
    </div>
  );
};

export default ProjectsPage;
