const fs = require('fs');
const content = fs.readFileSync('src/componants/About.jsx', 'utf8');

const techStackIconIndex = content.indexOf('const TechStackIcon =');
const aboutIndex = content.indexOf('const About =');

const techStackIconAndSVGs = content.substring(techStackIconIndex, aboutIndex);

const techStackComponent = `
const TechStack = ({ isDark }) => {
  // Tech stacks data with colored SVG icons
  const techStacks = [
    { icon: HTMLIcon, name: "HTML" },
    { icon: CSSIcon, name: "CSS" },
    { icon: JavaScriptIcon, name: "JavaScript" },
    { icon: ReactIcon, name: "React.js" },
    { icon: NodeJSIcon, name: "Node.js" },
    { icon: ExpressIcon, name: "Express.js" },
    { icon: MongoDBIcon, name: "MongoDB" },
    { icon: NextJSIcon, name: "Next.js" },
    { icon: MySQLIcon, name: "MySQL" },
    { icon: TailwindIcon, name: "Tailwind CSS" },
    { icon: TypeScriptIcon, name: "TypeScript" },
    { icon: PythonIcon, name: "Python" },
    { icon: GitIcon, name: "Git" },
    { icon: GitHubIcon, name: "GitHub" },
    { icon: DockerIcon, name: "Docker" },
    { icon: AWSIcon, name: "AWS" },
    { icon: FirebaseIcon, name: "Firebase" },
    { icon: ViteIcon, name: "Vite" },
    { icon: FigmaIcon, name: "Figma" },
    { icon: VercelIcon, name: "Vercel" },
  ];

  return (
    <div className="relative w-full">
      <p className="text-2xl font-medium text-gray-900 dark:text-white mb-6 mt-1 px-4">
        Tech Stacks
      </p>
      <div className="relative w-full py-1">
        <BackgroundLines className="absolute inset-0" />
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 md:gap-4 justify-items-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, staggerChildren: 0.1 }}
              >
                {techStacks.map((tech, index) => (
                  <TechStackIcon
                    key={tech.name}
                    icon={tech.icon}
                    name={tech.name}
                    delay={index}
                    isDark={isDark}
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TechStack;
`;

const fullTechStackContent = `import React from 'react';
import { motion } from 'framer-motion';
import { BackgroundLines } from '@/components/ui/background-lines';

` + techStackIconAndSVGs + techStackComponent;

fs.writeFileSync('src/componants/TechStack.jsx', fullTechStackContent);

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
