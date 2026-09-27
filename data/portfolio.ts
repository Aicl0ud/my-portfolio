export type StationId = "about" | "experience" | "projects" | "contact";

export type PortfolioStation = {
  id: StationId;
  label: string;
  shortLabel: string;
  tile: { x: number; y: number };
};

export const PORTFOLIO_STATIONS: PortfolioStation[] = [
  { id: "about", label: "About Kiw", shortLabel: "About", tile: { x: 10, y: 4 } },
  { id: "experience", label: "Experience & skills", shortLabel: "Experience", tile: { x: 10, y: 10 } },
  { id: "projects", label: "Selected projects", shortLabel: "Projects", tile: { x: 8, y: 7 } },
  { id: "contact", label: "Contact Kiw", shortLabel: "Contact", tile: { x: 4, y: 10 } },
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
    summary:
      "Building and improving financial technology products with a focus on dependable user experiences.",
  },
  {
    company: "Nuxos Consulting",
    role: "Junior Software Developer",
    period: "Jul 2021 — Jan 2022",
    summary:
      "Delivered web software and strengthened practical engineering foundations in a consulting environment.",
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

export const PROJECTS = [
  {
    name: "EV Charging Calculator",
    description:
      "A mobile-ready charging time and cost calculator with 60+ Thai EV models, realistic charging curves, offline support, and Firebase caching.",
    stack: ["Next.js", "TypeScript", "Firebase", "PWA"],
    sourceUrl: "https://github.com/Aicl0ud/ev-helper",
    liveUrl: null,
  },
  {
    name: "Retro Outing 2025",
    description: "An interactive event experience created for a team retrospective in Pattaya.",
    stack: ["Next.js", "TypeScript", "Vercel"],
    sourceUrl: "https://github.com/Aicl0ud/retro-outing-2025",
    liveUrl: "https://retro-outing-2025.vercel.app",
  },
  {
    name: "NFT Minter on Solana",
    description:
      "A TypeScript front end for minting NFTs on Solana, built while exploring web3 product development.",
    stack: ["TypeScript", "Solana", "Web3"],
    sourceUrl: "https://github.com/Aicl0ud/nft-minter-on-solana",
    liveUrl: "https://nft-minter-on-solana.vercel.app",
  },
  {
    name: "My Portfolio",
    description:
      "This explorable PixiJS portfolio: an experiment in combining product storytelling, accessibility, and a game-like interface.",
    stack: ["PixiJS", "React", "Next.js"],
    sourceUrl: "https://github.com/Aicl0ud/my-portfolio",
    liveUrl: null,
  },
];

export const CONTACTS = [
  { label: "Email", value: "teerasit.won@gmail.com", href: "mailto:teerasit.won@gmail.com" },
  { label: "GitHub", value: "Aicl0ud", href: "https://github.com/Aicl0ud" },
  {
    label: "LinkedIn",
    value: "teerasit-wongpa",
    href: "https://www.linkedin.com/in/teerasit-wongpa/",
  },
  { label: "Mobile", value: "+66 92 553 1998", href: "tel:+66925531998" },
];
