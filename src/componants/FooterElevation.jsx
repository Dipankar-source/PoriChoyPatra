import React from 'react'
import assets from '@/assets/assets';
import { useTheme } from '@/context/ThemeContext';

const Elevation = () => {
  const { isDark } = useTheme();

  return (
    <div className="w-full px-6 py-7 flex items-center justify-center bg-transparent">
      <div className="relative isolate flex min-h-[220px] w-full items-center justify-center overflow-hidden">
        <video
          key={isDark ? "dark-background" : "light-background"}
          src={isDark ? assets.BgVideo : assets.BgVideo1}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-white/35 dark:bg-black/35" />
        <blockquote className="relative z-10 max-w-md space-y-4 text-center">
          <span className="select-none text-4xl text-gray-300 dark:text-gray-600">
            "
          </span>
          <p className="dipfolio-font -mt-2 text-2xl font-extrabold leading-relaxed tracking-[0.05em] text-gray-900 dark:text-gray-200">
            The bumblebee doesn't study aerodynamics.
            <br />
            It just flies.
          </p>
          <div className="mx-auto h-px w-8 bg-gray-300 dark:bg-gray-600" />
        </blockquote>
      </div>
    </div>
  );
}

export default Elevation