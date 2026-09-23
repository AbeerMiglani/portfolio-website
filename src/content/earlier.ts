// Things from before university. Shown as small lines under Projects rather
// than as job-titled roles, and in the terminal's `earlier` command.
export type EarlierItem = {
  what: string;
  org: string;
  orgUrl?: string;
  when: string;
  summary: string;
  repo?: string;
};

export const earlier: EarlierItem[] = [
  {
    what: "Summer training in Grade 11",
    org: "LOHUM Cleantech",
    orgUrl: "https://lohum.com/",
    when: "Jun 2023",
    summary: "Built a metal-price scraper in Python with Selenium, exporting the data with Pandas.",
    repo: "https://github.com/AbeerMiglani/metal-price-scraper",
  },
];
