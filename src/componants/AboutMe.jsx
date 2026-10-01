import icons from '../assets/icons'
import { useTheme } from '../context/ThemeContext'
const StackItem = ({ item }) => {
  const { isDark } = useTheme();

  return (
    <div
      title={item.name}
      tabIndex={0}
      className="group/stack relative inline-flex size-9 shrink-0 items-center justify-center overflow-visible border border-dashed border-neutral-300 text-xs leading-none text-neutral-700 transition-colors hover:z-40 hover:bg-neutral-100 focus-visible:z-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-white/5"
    >
      <span className="flex size-4 shrink-0 items-center justify-center grayscale transition-[filter] duration-300 group-hover/stack:grayscale-0 group-focus-visible/stack:grayscale-0 [&_svg]:block [&_svg]:size-4 [&_svg]:shrink-0">
        <item.Icon isDark={isDark} />
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 min-w-max origin-bottom -translate-x-1/2 translate-y-1.5 scale-90 whitespace-nowrap rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold leading-none text-neutral-700 opacity-0 shadow-lg ring-1 ring-black/5 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-4 after:border-x-transparent after:border-b-transparent after:border-t-neutral-200 group-hover/stack:translate-y-0 group-hover/stack:scale-100 group-hover/stack:opacity-100 group-focus-visible/stack:translate-y-0 group-focus-visible/stack:scale-100 group-focus-visible/stack:opacity-100 dark:border-neutral-700 dark:bg-[#0F0F0F] dark:text-neutral-200 dark:after:border-t-neutral-700">
        {item.name}
      </span>
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
    <div className="relative w-full">
      <ul className="flex flex-col gap-3 text-[14px] leading-[1.55] text-neutral-700 dark:text-neutral-300 sm:text-[15px]">
        <li className="flex items-start gap-3 ">
          <span
            aria-hidden="true"
            className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500"
          />
          <p>
            I&apos;m a{" "}
            <strong className="cursor-pointer font-semibold text-neutral-950 underline decoration-neutral-400 underline-offset-2 dark:text-neutral-100 dark:decoration-neutral-500">
              full-stack developer
            </strong>{" "}
            passionate about building useful digital products with thoughtful
            design and clean, scalable code.
          </p>
        </li>
        <li className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500"
          />
          <p>
            I build{" "}
            <strong className="cursor-pointer font-semibold text-neutral-950 underline decoration-neutral-400 underline-offset-2 dark:text-neutral-100 dark:decoration-neutral-500">
              modern interfaces with React and Tailwind
            </strong>
            , focusing on usability, performance, and details that make products
            feel clear and intuitive.
          </p>
        </li>
        <li className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500"
          />
          <p>
            I enjoy turning ideas into{" "}
            <strong className="cursor-pointer font-semibold text-neutral-950 underline decoration-neutral-400 underline-offset-2 dark:text-neutral-100 dark:decoration-neutral-500">
              polished web apps
            </strong>
            , exploring new tools, and continually improving the way I design
            and develop.
          </p>
        </li>
      </ul>

      <div className="mt-7  pt-5 dark:border-neutral-800">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
          Toolkit
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {stackIcons.map((item) => (
            <StackItem key={item.name} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutMe