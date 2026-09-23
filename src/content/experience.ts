export type Role = {
  role: string;
  org: string;
  orgUrl?: string;
  place: string;
  start: string;
  end: string;
  bullets: string[];
  repo?: string;
};

export const experience: Role[] = [
  {
    role: "Technical Project Trainee, Special Projects",
    org: "LOHUM Cleantech",
    orgUrl: "https://lohum.com/",
    place: "Kasna, UP",
    start: "Jun 2023",
    end: "Jun 2023",
    bullets: [
      "Built an automated metal-price scraper in Python with Selenium WebDriver across multiple commodity pages.",
      "Used XPath selectors and explicit waits to reliably extract dynamically rendered content.",
      "Cleaned and exported pricing data with Pandas, plus a lightweight HTML dashboard to share it.",
    ],
    repo: "https://github.com/AbeerMiglani/metal-price-scraper",
  },
];
