import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { cmsApi } from '../../services/api';
import toast from 'react-hot-toast';

const QuoteModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const projectTypes = [
    'Building Construction',
    'Interior Fit Outs',
    'MEP Execution',
    'Project Management',
    'Cost Consultancy',
    'Architectural Design',
  ];

  const budgetRanges = [
    '10-25 Lakhs',
    '25-50 Lakhs',
    '50-1 Crore',
    '1-2 Crores',
    '2+ Crores',
  ];

  const onSubmit = async (data) => {
    try {
      await cmsApi.createLead({
        ...data,
        projectType: selectedType,
        budget: selectedBudget,
        source: 'quote-form',
        sourceDetails: 'Quote form modal',
      });
      toast.success('Quote request sent! We\'ll contact you soon.');
      reset();
      setStep(1);
      setSelectedType('');
      setSelectedBudget('');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send quote request');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-black text-navy mb-1">
              {step === 1 ? 'What\'s Your Project?' : 'Tell Us More'}
            </h2>
            <p className="text-sm text-mid">Step {step} of 2</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-mid hover:text-navy transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Project Type & Budget */}
          {step === 1 && (
            <div className="space-y-8">
              {/* Project Type Selection */}
              <div>
                <label className="block text-sm font-bold text-navy mb-4 uppercase tracking-[1px]">
                  Project Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {projectTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`p-4 rounded-xl border-2 font-bold text-sm transition-all ${
                        selectedType === type
                          ? 'border-navy bg-navy text-white'
                          : 'border-gray-200 text-navy hover:border-navy'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range Selection */}
              <div>
                <label className="block text-sm font-bold text-navy mb-4 uppercase tracking-[1px]">
                  Budget Range (Approx)
                </label>
                <div className="space-y-2">
                  {budgetRanges.map(budget => (
                    <button
                      key={budget}
                      type="button"
                      onClick={() => setSelectedBudget(budget)}
                      className={`w-full p-4 rounded-xl border-2 font-bold text-sm text-left transition-all ${
                        selectedBudget === budget
                          ? 'border-navy bg-navy text-white'
                          : 'border-gray-200 text-navy hover:border-navy'
                      }`}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!selectedType || !selectedBudget}
                className="w-full py-4 bg-navy text-white rounded-xl font-bold uppercase tracking-[2px] hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-mid uppercase mb-2 tracking-[1px]">Your Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-medium text-sm focus:outline-none focus:border-navy"
                  placeholder="Full name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-mid uppercase mb-2 tracking-[1px]">Email Address</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-medium text-sm focus:outline-none focus:border-navy"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-mid uppercase mb-2 tracking-[1px]">Phone Number</label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-medium text-sm focus:outline-none focus:border-navy"
                  placeholder="+91 93248 77493"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-mid uppercase mb-2 tracking-[1px]">Timeline</label>
                <select
                  {...register('timeline')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-medium text-sm focus:outline-none focus:border-navy"
                >
                  <option value="">Select timeline...</option>
                  <option value="Immediate">Immediate (0-3 months)</option>
                  <option value="Short-term">Short-term (3-6 months)</option>
                  <option value="Medium-term">Medium-term (6-12 months)</option>
                  <option value="Future">Future planning (12+ months)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-mid uppercase mb-2 tracking-[1px]">Project Description</label>
                <textarea
                  {...register('message', { required: 'Please describe your project', minLength: { value: 10, message: 'Min 10 characters' } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-medium text-sm focus:outline-none focus:border-navy resize-none"
                  placeholder="Tell us about your project, specific requirements, and vision..."
                  rows="4"
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              {/* Honeypot */}
              <input type="text" {...register('website')} style={{ display: 'none' }} />

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border-2 border-navy text-navy rounded-xl font-bold uppercase tracking-[2px] hover:bg-navy hover:text-white transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-navy text-white rounded-xl font-bold uppercase tracking-[2px] hover:bg-opacity-90 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? 'Sending...' : 'Send Quote Request'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default QuoteModal;
