import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee/index";

import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorBio,
  TestimonialAuthorName, // Remove TestimonialAuthorInfo from imports
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
  TestimonialVerifiedBadge,
} from "@/components/testimonials-marquee";

const TestiMonials = () => {
  return (
    <div className=" w-full border-1">
      <hr className="text-blue-100" />
      <div className="mt-13">
        <div className="w-full space-y-4 bg-background [&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch!">
          {[TESTIMONIALS_1, TESTIMONIALS_2].map((list, index) => (
            <Marquee key={index} className="border-y border-edge">
              <MarqueeFade side="left" />
              <MarqueeFade side="right" />

              <MarqueeContent direction={index % 2 === 1 ? "right" : "left"}>
                {list.map((item) => (
                  <MarqueeItem
                    key={item.url}
                    className="mx-0 h-full w-xs border-r border-edge"
                  >
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      <Testimonial>
                        <TestimonialQuote>
                          <p>{item.quote}</p>
                        </TestimonialQuote>

                        <TestimonialAuthor>
                          <TestimonialAvatar>
                            <TestimonialAvatarImg src={item.authorAvatar} />
                            <TestimonialAvatarRing />
                          </TestimonialAvatar>

                          <TestimonialAuthorName>
                            {item.authorName}
                            <TestimonialVerifiedBadge />
                          </TestimonialAuthorName>

                          <TestimonialAuthorBio>
                            {item.authorBio}
                          </TestimonialAuthorBio>
                        </TestimonialAuthor>
                      </Testimonial>
                    </a>
                  </MarqueeItem>
                ))}
              </MarqueeContent>
            </Marquee>
          ))}
        </div>
      </div>
    </div>
  );
};

const TESTIMONIALS_1 = [
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    authorName: "Marcus Chen",
    authorBio: "CTO @TechFlow Inc",
    url: "https://linkedin.com/in/marcuschen",
    quote:
      "Dipankar's technical expertise is exceptional. He delivered our web platform 2 weeks ahead of schedule while maintaining impeccable code quality. His React skills are top-tier.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    authorName: "Sarah Mitchell",
    authorBio: "Product Lead @DesignStudio Pro",
    url: "https://linkedin.com/in/sarahmitchell",
    quote:
      "Working with Dipankar was a game-changer for our design system. His attention to detail and user experience intuition resulted in a 40% improvement in user engagement metrics.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    authorName: "Alex Rodriguez",
    authorBio: "Engineering Manager @StartupGrid",
    url: "https://linkedin.com/in/alexrodriguez",
    quote:
      "Dipankar's full-stack capabilities are impressive. He seamlessly integrated complex backend systems with elegant frontend interfaces. A true asset to any engineering team.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
    authorName: "Priya Patel",
    authorBio: "Founder @InnovateLabs",
    url: "https://linkedin.com/in/priyapatel",
    quote:
      "The mobile application Dipankar built for us received 4.8 stars on app stores. His ability to understand business requirements and translate them into technical solutions is remarkable.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    authorName: "James Wilson",
    authorBio: "Senior Director @GlobalTech Solutions",
    url: "https://linkedin.com/in/jameswilson",
    quote:
      "Dipankar's performance optimization work increased our application speed by 60%. His systematic approach to problem-solving sets him apart from other developers.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
    authorName: "Dr. Emily Zhang",
    authorBio: "Head of AI Research @NeuroTech",
    url: "https://linkedin.com/in/emilyzhang",
    quote:
      "His machine learning integration work was flawless. Dipankar has a unique ability to bridge the gap between complex algorithms and user-friendly interfaces.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    authorName: "Olivia Thompson",
    authorBio: "UX Director @CreativeDigital",
    url: "https://linkedin.com/in/oliviathompson",
    quote:
      "Rarely do you find a developer with such strong design sensibilities. Dipankar's implementations always exceed visual expectations while maintaining technical excellence.",
  },
];

export const TESTIMONIALS_2 = [
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    authorName: "Daniel Kim",
    authorBio: "Lead Architect @CloudFirst",
    url: "https://linkedin.com/in/danielkim",
    quote: "Exceptional technical architect.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    authorName: "Isabella Rossi",
    authorBio: "CEO @EduTech Ventures",
    url: "https://linkedin.com/in/isabellarossi",
    quote: "Transformed our platform completely.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop&crop=face",
    authorName: "Michael Brown",
    authorBio: "VP Engineering @FinTech Global",
    url: "https://linkedin.com/in/michaelbrown",
    quote: "Rock-solid code, every time.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1556157382-97eda3ac2ad9?w=400&h=400&fit=crop&crop=face",
    authorName: "Sophia Williams",
    authorBio: "Product Manager @HealthTech Plus",
    url: "https://linkedin.com/in/sophiawilliams",
    quote: "A true problem-solver.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face",
    authorName: "David Lee",
    authorBio: "Technical Co-founder @AIStartup",
    url: "https://linkedin.com/in/davidlee",
    quote: "Fast learner, brilliant executor.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
    authorName: "Rachel Green",
    authorBio: "Director @Ecommerce Solutions",
    url: "https://linkedin.com/in/rachelgreen",
    quote: "Delivers beyond expectations.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=face",
    authorName: "Thomas Anderson",
    authorBio: "Senior DevOps Engineer @ScaleTech",
    url: "https://linkedin.com/in/thomasanderson",
    quote: "Infrastructure genius.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    authorName: "Robert Taylor",
    authorBio: "Lead Developer @WebSolutions",
    url: "https://linkedin.com/in/roberttaylor",
    quote: "Clean code specialist.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    authorName: "Lisa Wang",
    authorBio: "UX Manager @DigitalAgency",
    url: "https://linkedin.com/in/lisawang",
    quote: "Design and code perfection.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    authorName: "Kevin Martinez",
    authorBio: "CTO @StartupHub",
    url: "https://linkedin.com/in/kevinmartinez",
    quote: "Technical excellence personified.",
  },
];

export default TestiMonials;
