import React from 'react';
import { BRAND_LOGOS } from '../data/agencyData';

interface BrandMarkProps {
  className?: string;
  withBadge?: boolean;
}

/**
 * Renders the uploaded Brandfiy white monogram icon.
 * Use `withBadge` when placing on light backgrounds (#F8FAFC / #E9D5FF / #FFFFFF)
 * so the white logo icon sits inside a Deep Purple (#31006B) badge with full contrast.
 */
export const BrandMark: React.FC<BrandMarkProps> = ({
  className = 'h-8 w-8',
  withBadge = false,
}) => {
  if (withBadge) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-xl bg-[#31006B] p-1.5 shadow-sm ${className}`}
      >
        <img
          src={BRAND_LOGOS.icon}
          alt="Brandfiy monogram"
          className="h-full w-full object-contain"
        />
      </span>
    );
  }

  return (
    <img
      src={BRAND_LOGOS.icon}
      alt="Brandfiy monogram"
      className={`object-contain ${className}`}
    />
  );
};
