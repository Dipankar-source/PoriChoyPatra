const fs = require('fs');
const content = fs.readFileSync('src/componants/About.jsx', 'utf8');
const lines = content.split('\n');

const techIcons = lines.slice(51, 688).join('\n');
const techStackReturn = lines.slice(723, 764).join('\n');

const techStackContent = `import React from 'react';
import { motion } from 'framer-motion';
import { BackgroundLines } from '@/components/ui/background-lines';

${techIcons}

const TechStack = ({ isDark }) => {
  return (
${techStackReturn}
  );
};

export default TechStack;`;

fs.writeFileSync('src/componants/TechStack.jsx', techStackContent);

const aboutContent = `import React from 'react';
import AboutMe from './AboutMe';
import TechStack from './TechStack';

const About = ({ isDark }) => {
  return (
    <div className="w-full min-h-screen py-12 mt-28">
      <hr className="text-blue-100 mb-4" />
      <AboutMe />
      <br />
      <br />
      <hr className="text-blue-100 mt-3" />
      <br />
      <TechStack isDark={isDark} />
    </div>
  );
};

export default About;`;

fs.writeFileSync('src/componants/About.jsx', aboutContent);
