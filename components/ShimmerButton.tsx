"use client";
import { useState, useEffect, ReactNode } from "react";

interface ShimmerButtonProps {
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export default function ShimmerButton({
  icon,
  children,
  onClick,
  href,
  className = "",
}: ShimmerButtonProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [shimmerPosition, setShimmerPosition] = useState(-100);

  // Shimmer animation effect only when hovering
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isHovering) {
      // Start the animation when hovering
      interval = setInterval(() => {
        setShimmerPosition((prev) => (prev >= 100 ? -100 : prev + 3));
      }, 20);
    } else {
      // Reset shimmer position when not hovering
      setShimmerPosition(-100);
    }

    return () => clearInterval(interval);
  }, [isHovering]);

  const buttonContent = (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`relative inline-flex items-center px-4 py-2 bg-black text-white rounded-md overflow-hidden border border-white dark:border-white ${className}`}
    >
      <div className="relative z-10 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </div>
      <div
        className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white to-transparent transition-opacity duration-200"
        style={{
          transform: `translateX(${shimmerPosition}%)`,
          opacity: isHovering ? 0.2 : 0,
        }}
      />
    </button>
  );

  // If href is provided, render the button as a clickable link
  if (href) {
    return (
      <a
        href={href}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {buttonContent}
      </a>
    );
  }

  // Otherwise just return the button
  return buttonContent;
}
