import React from 'react';
import AboutMe from './AboutMe';

const About = ({ isDark }) => {
  return (
    <div className="w-full pt-12 mt-40">
      <hr className="text-blue-100 mb-4" />
      <AboutMe />
      <hr className="text-blue-100 mt-8" />

    </div>
  );
};

export default About;