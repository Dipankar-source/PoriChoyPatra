import { Quote } from "lucide-react";
import { GridSectionHeader } from "@/components/PageGridLines";

const testimonials = [
  {
    name: "Aditi Roy",
    quote: "Dipankar made my idea feel premium from the very first interaction.",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Rohit Sen",
    quote: "He brings clarity, craft, and a calm design process that actually works.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Moumita Das",
    quote: "The work feels thoughtful, polished, and instantly memorable.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Arup Mallick",
    quote: "Every detail felt intentional. The experience genuinely elevated the brand.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Sayan Ghosh",
    quote: "Fast, sharp, and beautifully executed — exactly how product work should feel.",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Priya Nandi",
    quote: "Clean thinking, strong execution, and a design sense that stands out.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  },
];

const TestimonialItem = ({ name, quote, image }) => (
  <article className="flex h-full w-[360px] shrink-0 flex-col justify-between border-b border-neutral-200 bg-white/90 px-4 py-4 shadow-[0_10px_25px_rgba(15,23,42,0.02)] transition-colors duration-300 dark:border-neutral-800 dark:bg-[#121212]/80 sm:w-[420px]">
    <div className="flex items-start gap-3">
      <img
        src={image}
        alt={name}
        className="h-11 w-11 rounded-full border border-neutral-200 object-cover dark:border-neutral-700"
      />
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <Quote className="h-3.5 w-3.5 shrink-0 text-neutral-500 dark:text-neutral-400" />
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
            Feedback
          </span>
        </div>
        <p className="line-clamp-3 text-[12px] leading-relaxed text-neutral-700 dark:text-neutral-300">
          “{quote}”
        </p>
      </div>
    </div>

    <div className="mt-4 border-t border-neutral-200 pt-3 dark:border-neutral-800">
      <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
        {name}
      </span>
    </div>
  </article>
);

const TestimonialsSection = () => {
  const marqueeItems = [...testimonials, ...testimonials];

  return (
    <section
      className="relative w-full px-4 py-6 sm:px-0 sm:py-7"
      aria-labelledby="testimonials-heading"
    >

      <GridSectionHeader className="mb-5  ">
        <div className="mb-3 mt-1.5 flex items-baseline justify-between gap-4">
          <h2
            id="testimonials-heading"
            className="aktura-font tracking-wider text-[28px] leading-tight text-neutral-950 dark:text-neutral-50"
          >
            Testimonials
          </h2>
        </div>
      </GridSectionHeader>

      <div className="relative z-30 overflow-hidden border-y border-neutral-200 dark:border-neutral-800">
        <div className="testimonial-marquee-track flex w-max items-stretch gap-0">
          {marqueeItems.map((item, index) => (
            <TestimonialItem key={`${item.name}-${index}`} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
