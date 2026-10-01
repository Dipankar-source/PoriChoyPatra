import AboutMe from "./AboutMe";
import PageGridLines from "@/components/PageGridLines";

const About = () => {
  return (
    <section
      className="relative w-full px-5 py-6 sm:px-4 sm:py-7"
      aria-labelledby="about-heading"
    >
      <PageGridLines section sectionOffset={27} />
      
      <div className="mb-5 flex items-center justify-between gap-4 mt-2.5">
        <h2
          id="about-heading"
          className="aktura-font tracking-wider text-[28px] leading-tight text-neutral-950 dark:text-neutral-50"
        >
          About
        </h2>
      </div>
      <PageGridLines section sectionOffset={79} />
      <AboutMe />
    </section>
  );
};

export default About;
