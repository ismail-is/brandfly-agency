import React, { useState } from 'react';
import { BrandMark } from './BrandMark';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fallbackTitle?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fallbackTitle,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#31006B] via-[#4B0BAA] to-[#31006B] p-6 text-center text-white ${className}`}
        role="img"
        aria-label={alt}
      >
        <BrandMark className="h-10 w-10 opacity-90" />
        <span className="mt-3 font-display text-xs font-bold uppercase tracking-widest text-[#C4B5FD]">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
