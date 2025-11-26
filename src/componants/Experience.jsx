import { WorkExperience } from "@/components/work-experience";

const Experience = () => {
  const WORK_EXPERIENCE = [
    {
      id: "3",
      companyName: "Samsung Innovation Campus",
      companyLogo: "https://assets.chanhdai.com/images/companies/quaric.svg",
      isCurrentEmployer: true,
      positions: [
        {
          id: "3-1",
          title: "Machine Learning & Artificial Intelligence",
          employmentPeriod: "Sept 2025 - Nov 2025",
          employmentType: "Full-Time",
          description:
            "Working on face recognition project with traditional algorithms",
          icon: "code",
          skills: [
            "Python",
            "Kaggle",
            "NumPy",
            "Pandas",
            "Matplotlib",
            "scikit-learn",
          ],
          isExpanded: true,
        },
      ],
    },
    {
      id: "1",
      companyName: "Gamonix",
      companyLogo: "https://assets.chanhdai.com/images/companies/quaric.svg",
      isCurrentEmployer: false,
      positions: [
        {
          id: "1-1",
          title: "Web Frontend Developer",
          employmentPeriod: "Jul 2025 - Oct 2025",
          employmentType: "Part-Time",
          description: "Building an analytic portal for the company",
          icon: "code",
          skills: [
            "JavaScript",
            "React",
            "tailwindcss",
            "framer-motion",
            "lucide-react",
            "react-icons",
          ],
          isExpanded: true,
        },
      ],
    },
    {
      id: "2",
      companyName: "EuphoriaGenX",
      companyLogo: "https://assets.chanhdai.com/images/companies/quaric.svg",
      isCurrentEmployer: false,
      positions: [
        {
          id: "2-1",
          title: "Web Frontend Developer",
          employmentPeriod: "Jul 2025 - Oct 2025",
          employmentType: "Part-Time",
          description: "Building an analytic portal for the company",
          icon: "code",
          skills: [
            "JavaScript",
            "React",
            "tailwindcss",
            "framer-motion",
            "lucide-react",
            "react-icons",
          ],
          isExpanded: true,
        },
      ],
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-300 border-1">
      <hr className="border-gray-200 dark:border-gray-800" />
      <br />
      <br />
      <p className="ml-4 text-xl lg:text-2xl font-medium text-gray-900 dark:text-white mb-2 pr-4">
        Work Experience
      </p>
      <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100 mt-5 font-sans ">
        <WorkExperience experiences={WORK_EXPERIENCE} />
      </div>
      <br />
      <br />
      {/* <hr className="border-gray-200 dark:border-gray-800" /> */}
    </div>
  );
};

export default Experience;
