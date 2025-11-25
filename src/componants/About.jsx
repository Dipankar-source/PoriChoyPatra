import { GlowingEffect } from "@/components/ui/glowing-effect";
import React from "react";
import { Box } from "lucide-react";
import { motion } from "framer-motion";
import { BackgroundLines } from "@/components/ui/background-lines";

// GridItem component definition - Modified for rectangular layout
const GridItem = ({ area, icon, title, description, children }) => {
  return (
    <li className={`min-h-[20rem] list-none mt-7 ${area}`}>
      <div className="relative h-full rounded-md border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-4">
            {/* Header with icon and title */}
            <div className="flex items-start gap-4">
              <div className="w-fit rounded-lg border border-gray-600 p-2 flex-shrink-0">
                {icon}
              </div>
              <div className="flex-1">
                <h3 className="font-sans text-xl font-semibold text-black md:text-2xl dark:text-white">
                  {title}
                </h3>
              </div>
            </div>

            {/* Content area - Perfect for writing */}
            <div className="flex-1 space-y-4">
              {/* Description */}
              <p className="font-sans text-sm text-black md:text-base dark:text-neutral-400 leading-relaxed">
                {description}
              </p>

              {/* Additional content area */}
              <div className="font-sans text-sm text-black md:text-base dark:text-neutral-300 leading-relaxed">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

// TechStackIcon component with hover effects and animations
const TechStackIcon = ({ icon: Icon, name, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{
        scale: 1.1,
        y: -5,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: delay * 0.1,
        ease: "easeOut",
      }}
      className="relative group"
    >
      <div className="relative p-4 flex items-center justify-center rounded-full lg:h-17 lg:w-17 h-10 w-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none transition-all duration-300 group-hover:shadow-lg group-hover:dark:shadow-gray-800/50">
        {/* Hover tooltip */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">
          <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap">
            {name}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-700"></div>
          </div>
        </div>

        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          className="flex items-center justify-center"
        >
          <Icon />
        </motion.div>
      </div>
    </motion.div>
  );
};

// SVG Icon Components with original colors
const ReactIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 18.9901C17.6569 18.9901 19 17.6469 19 15.9901C19 14.3332 17.6569 12.9901 16 12.9901C14.3431 12.9901 13 14.3332 13 15.9901C13 17.6469 14.3431 18.9901 16 18.9901Z" fill="#61DAFB"/>
    <path d="M16 21.3411C23.362 21.3411 29.34 19.1051 29.34 16.4011C29.34 13.6971 23.362 11.4611 16 11.4611C8.638 11.4611 2.66 13.6971 2.66 16.4011C2.66 19.1051 8.638 21.3411 16 21.3411Z" stroke="#61DAFB" strokeWidth="1.5"/>
    <path d="M11.126 18.6591C13.78 24.4091 16.852 28.6651 19.14 27.8491C21.428 27.0331 22.084 21.7911 19.43 16.0411C16.776 10.2911 13.704 6.03509 11.416 6.85109C9.128 7.66709 8.472 12.9091 11.126 18.6591Z" stroke="#61DAFB" strokeWidth="1.5"/>
    <path d="M11.126 13.3211C8.472 19.0711 9.128 24.3131 11.416 25.1291C13.704 25.9451 16.776 21.6891 19.43 15.9391C22.084 10.1891 21.428 4.94709 19.14 4.13109C16.852 3.31509 13.78 7.57109 11.126 13.3211Z" stroke="#61DAFB" strokeWidth="1.5"/>
  </svg>
);

const NextJSIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="black"/>
    <path d="M19.0125 9.5H21.5781V19.3281L13.7094 9.5H11.125V22.5H13.5469V12.6719L21.4156 22.5H24V9.5H19.0125Z" fill="white"/>
  </svg>
);

const NodeJSIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30Z" fill="#339933"/>
    <path d="M20.5 11.5H15.5V20.5H20.5V11.5Z" fill="white"/>
    <path d="M15.5 11.5H10.5V20.5H15.5V11.5Z" fill="white"/>
    <path d="M20.5 20.5H25.5V11.5H20.5V20.5Z" fill="white"/>
  </svg>
);

const ExpressIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16Z" fill="#000000"/>
    <path d="M24 12H8V14H24V12ZM24 16H8V18H24V16ZM8 20H24V22H8V20Z" fill="#FFFFFF"/>
  </svg>
);

const MongoDBIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30Z" fill="#47A248"/>
    <path d="M17 10L16 9L15 10C15 10 12 13 12 16C12 19 14 22 16 22C18 22 20 19 20 16C20 13 17 10 17 10Z" fill="white"/>
  </svg>
);

const PostgresIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30Z" fill="#336791"/>
    <path d="M12 12H20V20H12V12Z" fill="white"/>
    <path d="M12 12H16V20H12V12Z" fill="#336791"/>
  </svg>
);

const TailwindIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 9.00001C10.8 9.00001 8.4 12.4 8.8 16.6C9.2 20.8 12.6 22.6 16 22.6C19.4 22.6 20.8 24.4 20.8 26.2C20.8 28 19.4 30 16 30C12.6 30 10.2 27.6 10.6 23.4M16 9.00001C21.2 9.00001 23.6 12.4 23.2 16.6C22.8 20.8 19.4 22.6 16 22.6C12.6 22.6 11.2 24.4 11.2 26.2C11.2 28 12.6 30 16 30C19.4 30 21.8 27.6 21.4 23.4" stroke="#38BDF8" strokeWidth="2"/>
  </svg>
);

const TypeScriptIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" fill="#3178C6"/>
    <path d="M19 20V18H23V20H19ZM19 16V14H25V16H19ZM19 12V10H27V12H19ZM9 10V22H17V18H13V14H17V10H9Z" fill="white"/>
  </svg>
);

const JavaScriptIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" fill="#F7DF1E"/>
    <path d="M21 24L23 22C23.8 23 24.8 23.6 26 23.6C27.2 23.6 28 23 28 22.2C28 21.4 27.4 21 25.8 20.4L25 20.2C22.6 19.4 21 18.4 21 16C21 13.8 22.8 12 25.4 12C27 12 28.4 12.6 29.4 13.8L27.6 15.6C27 15 26.2 14.6 25.4 14.6C24.6 14.6 24 15.2 24 15.8C24 16.6 24.6 17 26.2 17.6L27 17.8C29.8 18.8 31.2 19.8 31.2 22.2C31.2 25 28.6 26.4 25.8 26.4C22.8 26.4 21 25.2 20 23.8L21 24ZM13 24L15 22C15.8 23 16.8 23.6 18 23.6C19.2 23.6 20 23 20 22.2C20 21.4 19.4 21 17.8 20.4L17 20.2C14.6 19.4 13 18.4 13 16C13 13.8 14.8 12 17.4 12C19 12 20.4 12.6 21.4 13.8L19.6 15.6C19 15 18.2 14.6 17.4 14.6C16.6 14.6 16 15.2 16 15.8C16 16.6 16.6 17 18.2 17.6L19 17.8C21.8 18.8 23.2 19.8 23.2 22.2C23.2 25 20.6 26.4 17.8 26.4C14.8 26.4 13 25.2 12 23.8L13 24Z" fill="black"/>
  </svg>
);

const PythonIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M15.885 2C11.119 2 11.229 4.153 11.229 4.153L11.242 7.577H16V8.669H8.958C8.958 8.669 5 8.538 5 15.94C5 23.343 8.567 23.415 8.567 23.415H11.095V20.301C11.095 20.301 10.997 17.137 14.709 17.137H18.419C18.419 17.137 21.673 17.055 21.673 13.845V9.322C21.673 9.322 21.823 6.229 18.419 6.229H12.915C12.915 6.229 9.885 6.312 9.885 10.323V14.847H8.567V10.323C8.567 10.323 8.215 5 13.981 5H18.419C18.419 5 23 5.153 23 9.322V13.845C23 18.015 19.151 18.015 19.151 18.015H15.441C15.441 18.015 11.995 18.092 11.995 21.208V23.415H15.441C15.441 23.415 26 23.308 26 15.94C26 8.572 20.651 8.669 20.651 8.669H18.419V7.577H23.008V4.153C23.008 4.153 23.224 2 15.885 2Z" fill="#3776AB"/>
    <path d="M12.327 11.154C13.008 11.154 13.562 10.6 13.562 9.919C13.562 9.238 13.008 8.684 12.327 8.684C11.646 8.684 11.092 9.238 11.092 9.919C11.092 10.6 11.646 11.154 12.327 11.154Z" fill="#3776AB"/>
    <path d="M19.673 23.846C18.992 23.846 18.438 24.4 18.438 25.081C18.438 25.762 18.992 26.316 19.673 26.316C20.354 26.316 20.908 25.762 20.908 25.081C20.908 24.4 20.354 23.846 19.673 23.846Z" fill="#FFD43B"/>
  </svg>
);

const GitIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M2 16L12 26L22 16L16 10L12 14L18 20L8 20L14 14L10 10L2 16Z" fill="#F05032"/>
  </svg>
);

const DockerIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30Z" fill="#2496ED"/>
    <path d="M10 12H7V15H10V12ZM13 12H10V15H13V12ZM16 12H13V15H16V12ZM19 12H16V15H19V12ZM10 9H7V12H10V9ZM13 9H10V12H13V9ZM16 9H13V12H16V9ZM13 6H10V9H13V6ZM16 6H13V9H16V6Z" fill="white"/>
  </svg>
);

const AWSIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30Z" fill="#FF9900"/>
    <path d="M8 20L10 18L12 20L14 18L16 20L18 18L20 20L22 18L24 20L22 22L20 20L18 22L16 20L14 22L12 20L10 22L8 20Z" fill="white"/>
  </svg>
);

const FirebaseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30Z" fill="#FFCA28"/>
    <path d="M16 10L20 18L16 22L12 18L16 10Z" fill="#FFA000"/>
    <path d="M16 10L20 18L16 22L12 18L16 10Z" fill="#F57C00" opacity="0.5"/>
  </svg>
);

const GraphQLIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30Z" fill="#E535AB"/>
    <path d="M16 10L22 20H10L16 10Z" fill="white"/>
    <path d="M16 22L10 12L22 12L16 22Z" fill="white"/>
  </svg>
);

const RedisIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30Z" fill="#DC382D"/>
    <path d="M16 10L22 16L16 22L10 16L16 10Z" fill="white"/>
    <path d="M16 13L19 16L16 19L13 16L16 13Z" fill="#DC382D"/>
  </svg>
);

const About = () => {
  // Tech stacks data with colored SVG icons
  const techStacks = [
    { icon: ReactIcon, name: "React.js" },
    { icon: NextJSIcon, name: "Next.js" },
    { icon: NodeJSIcon, name: "Node.js" },
    { icon: ExpressIcon, name: "Express.js" },
    { icon: MongoDBIcon, name: "MongoDB" },
    { icon: PostgresIcon, name: "PostgreSQL" },
    { icon: TailwindIcon, name: "Tailwind CSS" },
    { icon: TypeScriptIcon, name: "TypeScript" },
    { icon: JavaScriptIcon, name: "JavaScript" },
    { icon: PythonIcon, name: "Python" },
    { icon: GitIcon, name: "Git" },
    { icon: DockerIcon, name: "Docker" },
    { icon: AWSIcon, name: "AWS" },
    { icon: FirebaseIcon, name: "Firebase" },
    { icon: GraphQLIcon, name: "GraphQL" },
    { icon: RedisIcon, name: "Redis" },
  ];

  return (
    <div className="w-full min-h-screen py-12 border-b-1 border-l-1 border-r-1 mt-28">
      <hr className="text-blue-100 mb-4" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="grid grid-cols-1 gap-8">
          <GridItem
            area=""
            icon={<Box className="h-6 w-6 text-black dark:text-neutral-400" />}
            title="About Me"
            description="Full Stack Developer passionate about creating digital experiences that make a difference."
          >
            <div className="space-y-4">
              <p>
                I'm a MERN stack developer with a keen eye for design and a
                passion for building scalable, efficient web applications. With
                expertise in modern technologies and frameworks, I bring ideas
                to life through clean code and intuitive user experiences.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-semibold text-black dark:text-white mb-2">
                    Skills
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• React.js & Next.js</li>
                    <li>• Node.js & Express</li>
                    <li>• MongoDB & PostgreSQL</li>
                    <li>• Tailwind CSS & Styled Components</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-black dark:text-white mb-2">
                    Experience
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• 3+ Years in Web Development</li>
                    <li>• 50+ Projects Completed</li>
                    <li>• Client-focused Solutions</li>
                    <li>• Agile Methodology</li>
                  </ul>
                </div>
              </div>

              <p className="pt-4">
                When I'm not coding, you can find me exploring new technologies,
                contributing to open-source projects, or sharing knowledge with
                the developer community.
              </p>
            </div>
          </GridItem>
        </div>
      </div>
      <br />
      <br />
      <hr className="text-blue-100 mt-3" />
      <br />

      {/* Tech Stacks Section */}
      <div className="relative w-full">
        <p className="text-2xl font-medium text-gray-900 dark:text-white mb-1 mt-3 px-4 mb-4">
          Tech Stacks
        </p>

        {/* Background Lines Container */}
        <div className="relative h-[10rem] w-full">
          <BackgroundLines className="absolute inset-0" />

          {/* Tech Stacks Content - Positioned on top of background lines */}
          <div className="absolute inset-0 flex items-center justify-center py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Tech Icons Grid */}
                <motion.div
                  className="grid grid-cols-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-6 mb-2"
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
                    />
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;