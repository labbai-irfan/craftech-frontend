import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, ImagePlus, Loader2, CheckCircle2 } from 'lucide-react';

export default function ImageDropzone({
  onUpload,
  multiple = true,
  label = 'Drop images here',
  uploading,
  accept,
}) {
  const [previews, setPreviews] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const newPreviews = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPreviews((prev) => (multiple ? [...prev, ...newPreviews] : newPreviews));
  }, [multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multiple,
  });

  const remove = (index) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = () => {
    if (previews.length && onUpload) {
      onUpload(previews.map((p) => p.file));
      setPreviews([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className="relative cursor-pointer rounded-2xl transition-all duration-300 overflow-hidden"
        style={{
          border: `2px dashed ${isDragActive ? '#C41B1F' : 'rgba(255,255,255,0.12)'}`,
          background: isDragActive
            ? 'rgba(196,27,31,0.06)'
            : 'rgba(10,38,71,0.2)',
          boxShadow: isDragActive ? '0 0 0 4px rgba(196,27,31,0.08), inset 0 0 40px rgba(196,27,31,0.04)' : 'none',
        }}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300"
            style={{
              background: isDragActive ? 'rgba(196,27,31,0.15)' : 'rgba(255,255,255,0.06)',
              transform: isDragActive ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {isDragActive
              ? <Upload className="w-6 h-6" style={{ color: '#C41B1F' }} />
              : <ImagePlus className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.4)' }} />
            }
          </div>
          <p
            className="text-sm font-semibold mb-1 transition-colors"
            style={{ color: isDragActive ? '#C41B1F' : 'rgba(255,255,255,0.7)' }}
          >
            {isDragActive ? 'Release to drop files' : label}
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            or <span style={{ color: '#C41B1F' }}>browse files</span> &nbsp;·&nbsp; JPG, PNG, WebP up to 10MB
          </p>
          {multiple && (
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Multiple files supported
            </p>
          )}
        </div>
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {previews.length} file{previews.length > 1 ? 's' : ''} selected
            </p>
            <button
              type="button"
              onClick={() => setPreviews([])}
              className="text-xs transition-colors"
              style={{ color: 'rgba(255,255,255,0.3)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
            {previews.map((p, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden group"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <img src={p.preview} alt="" className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(196,27,31,0.9)' }}
                >
                  <X className="w-3 h-3 text-white" />
                </button>
                <span
                  className="absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                  style={{ background: 'rgba(0,0,0,0.7)', color: 'rgba(255,255,255,0.8)' }}
                >
                  {i + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Upload button */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: uploading
                ? 'rgba(196,27,31,0.5)'
                : 'linear-gradient(135deg, #C41B1F 0%, #8b0000 100%)',
              boxShadow: uploading ? 'none' : '0 4px 20px rgba(196,27,31,0.3)',
            }}
          >
            {uploading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
              : <><Upload className="w-4 h-4" /> Upload {previews.length} file{previews.length > 1 ? 's' : ''}</>
            }
          </button>
        </div>
      )}
    </div>
  );
}
