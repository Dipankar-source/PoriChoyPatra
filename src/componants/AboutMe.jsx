import React from 'react'
import icons from '../assets/icons'
import { useTheme } from '../context/ThemeContext'
import { ScrollFountain } from '@/components/ui/scroll-fountain-text';
const StackItem = ({ item }) => {
  const { isDark } = useTheme();

  return (
    <div className="relative h-8 w-[44px] flex-shrink-0">
      <div
        className="group absolute top-0 left-0 z-10 hover:z-50 flex items-center h-8 px-2 border border-transparent hover:border-neutral-500 hover:border-dotted cursor-pointer overflow-hidden backdrop-blur-md rounded-sm hover:bg-neutral-200 dark:hover:bg-[#26262680] transition-all duration-300 ease-out"
      >
        <div
          className="flex items-center justify-center transition-all duration-300 flex-shrink-0"
        >
          <item.Icon isDark={isDark} />
        </div>
        <div
          className="flex items-center overflow-hidden transition-all duration-300 max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 group-hover:ml-2"
        >
          <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
            {item.name}
          </span>
        </div>
      </div>
    </div>
  );
};

const AboutMe = () => {
  const stackIcons = [
    { name: 'HTML', type: 'Frontend', Icon: icons.HTMLIcon },
    { name: 'CSS', type: 'Frontend', Icon: icons.CSSIcon },
    { name: 'JavaScript', type: 'Language', Icon: icons.JavaScriptIcon },
    { name: 'React', type: 'Frontend', Icon: icons.ReactIcon },
    { name: 'Tailwind CSS', type: 'Frontend', Icon: icons.TailwindIcon },
    { name: 'Node.js', type: 'Backend', Icon: icons.NodeJSIcon },
    { name: 'Express', type: 'Backend', Icon: icons.ExpressIcon },
    { name: 'MongoDB', type: 'Database', Icon: icons.MongoDBIcon },
    { name: 'MySQL', type: 'Database', Icon: icons.MySQLIcon },
    { name: 'Firebase', type: 'Backend', Icon: icons.FirebaseIcon },
    { name: 'Vercel', type: 'Deployment', Icon: icons.VercelIcon },
    { name: 'Vite', type: 'Tooling', Icon: icons.ViteIcon },
    { name: 'Figma', type: 'Design', Icon: icons.FigmaIcon },
    { name: 'Python', type: 'Language', Icon: icons.PythonIcon },
    { name: 'Git', type: 'Tooling', Icon: icons.GitIcon },
    { name: 'GitHub', type: 'Tooling', Icon: icons.GitHubIcon },
    { name: 'framer-motion', type: 'Tooling', Icon: icons.FramerMotionIcon },
    { name: 'AceternityUI', type: 'Tooling', Icon: icons.AceternityUIIcon },
    { name: 'shadcn-ui', type: 'Tooling', Icon: icons.ShadcnUIIcon },
    { name: 'C', type: 'Tooling', Icon: icons.CIcon },
    { name: 'lucide-react', type: 'Tooling', Icon: icons.LucideReactIcon },
    { name: 'Kaggle', type: 'Tooling', Icon: icons.KaggleIcon },
    { name: 'pandas', type: 'Tooling', Icon: icons.PandasIcon },
    { name: 'numpy', type: 'Tooling', Icon: icons.NumPyIcon },
    { name: 'matplotlib', type: 'Tooling', Icon: icons.MatplotlibIcon },
    { name: 'Postman', type: 'Tooling', Icon: icons.PostmanIcon },
    { name: 'Gemini', type: 'Tooling', Icon: icons.GeminiIcon },
    { name: 'Claude', type: 'Tooling', Icon: icons.ClaudeIcon },
    { name: 'Antigravity', type: 'Tooling', Icon: icons.AntigravityIcon },
    { name: 'VS', type: 'Tooling', Icon: icons.VSCodeIcon },


  ];

  return (
    <div className='relative w-full'>
      <div className='px-4'>
        <p className="text-xl md:text-2xl  font-medium text-gray-900 dark:text-white mb-6 mt-1 ">
          <ScrollFountain particleCount={25}>
            About
          </ScrollFountain>

        </p>
        <div className='relative w-full flex flex-col gap-3'>
          <div className='flex gap-3 items-start'>
            <div className='w-2 h-2 rounded-full bg-neutral-800 dark:bg-neutral-300 mt-1.5 flex-shrink-0'></div>
            <p className="font-sans text-sm text-neutral-700 md:text-base dark:text-neutral-400 leading-relaxed">
              I'm a <span className="underline decoration-neutral-400 dark:decoration-neutral-500 text-neutral-950 dark:text-neutral-200 font-medium">full-stack developer</span> building real-world web apps.
            </p>
          </div>
          <div className='flex gap-3 items-start'>
            <div className='w-2 h-2 rounded-full bg-neutral-800 dark:bg-neutral-300 mt-1.5 flex-shrink-0'></div>
            <p className="font-sans text-sm text-neutral-700 md:text-base dark:text-neutral-400 leading-relaxed">
              I focus on writing <span className="underline decoration-neutral-400 dark:decoration-neutral-500 text-neutral-950 dark:text-neutral-200 font-medium">clean code</span> and solving problems efficiently.
            </p>
          </div>
          <div className='flex gap-3 items-start'>
            <div className='w-2 h-2 rounded-full bg-neutral-800 dark:bg-neutral-300 mt-1.5 flex-shrink-0'></div>
            <p className="font-sans text-sm text-neutral-700 md:text-base dark:text-neutral-400 leading-relaxed">
              I am dedicated to <span className="underline decoration-neutral-400 dark:decoration-neutral-500 text-neutral-950 dark:text-neutral-200 font-medium">continuous learning</span> and improving my skills.
            </p>
          </div>
        </div>


        <div>
          <p className='text-md font-semibold text-neutral-900 dark:text-neutral-300 mt-5'>Stacks</p>
          <div className='w-full flex flex-wrap gap-1 mt-4'>
            {stackIcons.map((item, index) => (
              <StackItem key={index} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutMe