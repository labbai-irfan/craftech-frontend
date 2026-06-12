import React, { createContext, useContext, useState, useEffect } from 'react';
import { cmsApi } from '../services/api';

const CMSContext = createContext();

export const CMSProvider = ({ children }) => {
  const [homeData, setHomeData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [processSteps, setProcessSteps] = useState([]);
  const [whyFeatures, setWhyFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          cmsApi.getHome(),
          cmsApi.getSettings(),
          cmsApi.getProcessSteps(),
          cmsApi.getWhyFeatures(),
          cmsApi.getTestimonials()
        ]);

        if (results[0].status === 'fulfilled') setHomeData(results[0].value.data.data);
        if (results[1].status === 'fulfilled') setSettings(results[1].value.data.data);
        if (results[2].status === 'fulfilled') setProcessSteps(results[2].value.data.data || []);
        if (results[3].status === 'fulfilled') setWhyFeatures(results[3].value.data.data || []);
        // If we want to add testimonials state later, we can do it here
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <CMSContext.Provider value={{ homeData, settings, processSteps, whyFeatures, loading, error }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => useContext(CMSContext);
