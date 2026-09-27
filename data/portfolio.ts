export type StationId = "about" | "experience" | "contact";

export type PortfolioStation = {
  id: StationId;
  label: string;
  shortLabel: string;
  color: string;
  position: { x: number; z: number };
};

export const PORTFOLIO_STATIONS: PortfolioStation[] = [
  {
    id: "about",
    label: "About Kiw",
    shortLabel: "About",
    color: "#ef6b69",
    position: { x: -3.6, z: 2.15 },
  },
  {
    id: "experience",
    label: "Experience & skills",
    shortLabel: "Experience",
    color: "#72d5ac",
    position: { x: 3.65, z: 2.9 },
  },
  {
    id: "contact",
    label: "Contact Kiw",
    shortLabel: "Contact",
    color: "#72aef2",
    position: { x: 4.35, z: -1.65 },
  },
];

export const PROFILE = {
  name: "Teerasit “Kiw” Wongpa",
  location: "Bangkok, Thailand",
  introduction:
    "Software engineer and lifelong learner who enjoys turning complex ideas into useful, reliable products.",
  education: "B.Sc. in Information and Communication Technology, Mahidol University",
  interests: ["Product engineering", "JavaScript", "Web platforms", "Blockchain"],
};

export const EXPERIENCE = [
  {
    company: "Opn",
    role: "Software Engineer",
    period: "Jan 2023 — Present",
    summary: "Building and improving financial technology products with a focus on dependable user experiences.",
  },
  {
    company: "Nuxos Consulting",
    role: "Junior Software Developer",
    period: "Jul 2021 — Jan 2022",
    summary: "Delivered web software and strengthened practical engineering foundations in a consulting environment.",
  },
];

export const SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Ruby on Rails",
  "C#",
  "Solidity",
  "Rust",
  "Tailwind CSS",
];

export const CONTACTS = [
  { label: "Email", value: "teerasit.won@gmail.com", href: "mailto:teerasit.won@gmail.com" },
  { label: "GitHub", value: "Aicl0ud", href: "https://github.com/Aicl0ud" },
  { label: "LinkedIn", value: "teerasit-wongpa", href: "https://www.linkedin.com/in/teerasit-wongpa/" },
  { label: "Mobile", value: "+66 92 553 1998", href: "tel:+66925531998" },
];
