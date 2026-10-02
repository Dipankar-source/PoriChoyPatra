import ExperienceSection from "@/componants/Experience";
import PageFrame, { BackBar, Hatch } from "@/components/PageFrame";

const Experience = () => (
  <PageFrame>
    <BackBar to="/" label="Home" />
    <ExperienceSection />
    <Hatch />
  </PageFrame>
);

export default Experience;