import React from 'react'

const Elevation = () => {
  return (
    <div className="w-full px-6 py-7 flex items-center justify-center bg-transparent">
      <blockquote className="max-w-md text-center space-y-4">
        <span className="text-3xl text-gray-300 dark:text-gray-600 select-none">"</span>
        <p className="text-base font-medium leading-relaxed tracking-wide text-gray-800 dark:text-gray-200 -mt-2">
          The bumblebee doesn't study aerodynamics.
          <br />
          It just flies.
        </p>
        <div className="mx-auto w-8 h-px bg-gray-300 dark:bg-gray-600" />
        {/* <cite className="text-xs uppercase tracking-widest text-gray-400 not-italic">
          — Bumble Bee...
        </cite> */}
      </blockquote>
    </div>
  )
}

export default Elevation