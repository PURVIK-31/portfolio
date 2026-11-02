import React from "react";

const person = {
  firstName: "Purvik",
  lastName: "Sharma",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Full Stack Developer",
  avatar: "/images/profile/profile.jpg",
  email: "mepurviksharma@gmail.com",
  location: "Asia/Kolkata", // IANA time zone identifier for India
  city: "Jaipur",
  region: "Rajasthan",
  country: "India",
  languages: ["English", "Hindi"],
  // Short, factual bio reused in JSON-LD, llms.txt and meta descriptions
  bio: "Purvik Sharma is a full stack developer from Jaipur, India, building fast, accessible web apps with React, Next.js, Node.js, TypeScript, Python and Rust.",
  knowsAbout: [
    "Full Stack Development",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "Python",
    "Rust",
    "WebSockets",
    "Docker",
    "Web Performance",
    "Web Crawling",
    "Data Engineering",
    "Web3",
  ],
  alumniOf: "Rajasthan Technical University",
};

// The Mailchimp form needs a real list URL (config.js -> mailchimp.action).
// Disabled until one is set up; the home page shows a contact CTA instead.
const newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: (
    <>
      I occasionally write about JavaScript, TypeScript, Rust, and modern web development.
    </>
  ),
};

const social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/PURVIK-31",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/purviksharma/",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
  {
    name: "LeetCode",
    icon: "leetcode",
    link: "https://leetcode.com/u/purvik31/",
  },
  {
    name: "CodeStudio",
    icon: "code",
    link: "https://www.naukri.com/code360/profile/purvik",
  },
];

const home = {
  path: "/",
  image: "/images/profile/profile.jpg",
  label: "Home",
  title: `${person.name} – Full Stack Developer (React, Next.js, Node.js)`,
  description: `${person.name} is a full stack developer from Jaipur, India building fast, accessible web apps with React, Next.js, Node.js, TypeScript, Python and Rust. See projects, case studies and blog posts.`,
  availability: "Open to internships & freelance work",
  statusShort: "open to work",
  headline: <>I build fast, real-time web apps that people enjoy using</>,
  // Cycled in the hero h1; the first word is the server-rendered (SEO) one
  headlineWords: ["real-time", "AI-powered", "scalable", "blazing-fast"],
  featured: {
    display: true,
    title: <>Website Ingestion Pipeline</>,
    href: "/work/website-crawler",
  },
  subline: (
    <>
      From pixel-perfect React UIs to WebSocket backends and Python data pipelines, I ship the whole stack.
    </>
  ),
  stack: ["Next.js", "React", "TypeScript", "Node.js", "MongoDB", "Python", "Rust", "Docker"],
  services: [
    {
      title: "Frontend that feels fast",
      description:
        "Responsive, accessible interfaces in React and Next.js — server components, smart code-splitting and Core Web Vitals treated as features, not afterthoughts.",
      tools: ["Next.js", "React", "TypeScript", "Tailwind"],
    },
    {
      title: "Real-time backends & APIs",
      description:
        "Node.js and Express APIs, WebSocket chat and live collaboration, JWT auth and MongoDB data models that hold up when traffic grows.",
      tools: ["Node.js", "Socket.io", "MongoDB", "Convex"],
    },
    {
      title: "Data, AI & DevOps",
      description:
        "Python crawlers and data pipelines, AI-powered features, and Dockerised deployments monitored with Prometheus and Grafana.",
      tools: ["Python", "FastAPI", "Docker", "AWS"],
    },
  ],
  // Visible Q&A on the home page + FAQPage JSON-LD (answer engine optimisation)
  faq: [
    {
      question: "Who is Purvik Sharma?",
      answer:
        "Purvik Sharma is a full stack developer from Jaipur, Rajasthan, India and a B.Tech Computer Science student at Rajasthan Technical University (2023–2027). He builds web applications with React, Next.js, Node.js, TypeScript, Python and Rust, and has interned as a software engineer at Bhoomitrace and Sbl.so.",
    },
    {
      question: "What technologies does Purvik Sharma work with?",
      answer:
        "Frontend: React, Next.js, TypeScript and Tailwind CSS. Backend: Node.js, Express, MongoDB, Prisma, Convex and WebSockets. Also Python (Streamlit, data tooling), Rust, Docker, Kubernetes, Prometheus, Grafana and AWS.",
    },
    {
      question: "What has Purvik Sharma built?",
      answer:
        "Projects include a website ingestion pipeline (an async Python crawler that exports clean datasets for RAG and SEO analysis), a real-time interview platform with a live code editor and video calls, an AI voice-agent interview practice app, a real-time chat app with Socket.io, a multi-chain crypto wallet (Ethereum and Solana) and a real-time stock analysis dashboard.",
    },
    {
      question: "Is Purvik Sharma available for work?",
      answer:
        "Yes. Purvik is open to internships, freelance projects and collaborations. The fastest way to reach him is by email at mepurviksharma@gmail.com or on LinkedIn.",
    },
  ],
};

const about = {
  path: "/about",
  label: "About",
  title: `About ${person.name} – Full Stack Developer from Jaipur, India`,
  description: `About ${person.name}: full stack developer and CSE student at RTU, Jaipur. Experience, education and skills across React, Next.js, Node.js, Python, Rust and DevOps.`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://www.linkedin.com/in/purviksharma/",
    label: "Connect here"
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        I'm a Jaipur-based full stack developer and Computer Science student who enjoys turning rough ideas into
        fast, polished products. I work across the whole stack — React and Next.js on the front, Node.js, MongoDB
        and real-time WebSockets on the back — and reach for Python and Rust when a problem calls for data
        crunching or raw performance. I care about clean UX, measurable performance and shipping things people use.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    // Newest first. `location` is optional.
    experiences: [
      {
        company: "Bhoomitrace",
        timeframe: "June 2026 - July 2026",
        role: "SWE Intern",
        location: "Jaipur, Rajasthan",
        achievements: [],
        images: []
      },
      {
        company: "Sbl.so",
        timeframe: "March 2026 - June 2026",
        role: "SDE Intern",
        location: "Remote",
        achievements: [
          <>
            Developed a full-stack internal SaaS platform using Next.js, Node.js, PostgreSQL and Drizzle ORM to streamline onboarding, payouts and operational workflows.
          </>,
          <>
            Spearheaded the platform's ambassador initiative by onboarding 6 ambassadors through custom landing pages, resulting in 150+ expert signups and 50+ waitlist profiles.
          </>,
          <>
            Built 3 production dashboards for task management, analytics, ambassador tracking and payout processing, and engineered a real-time gamified scoring system.
          </>,
          <>
            Automated onboarding and compliance workflows through PDF generation, digital contract signing and LinkedIn API integrations.
          </>,
        ],
        images: []
      },
      {
        company: "Sbl.so",
        timeframe: "August 2025 - June 2026",
        role: "Community Onboarding Specialist",
        location: "Bengaluru, Karnataka",
        achievements: [],
        images: []
      },
      {
        company: "Unstop",
        timeframe: "August 2025 - Present",
        role: "Campus Ambassador",
        achievements: [],
        images: []
      },
      {
        company: "Coding Blocks",
        timeframe: "September 2025 - June 2026",
        role: "Campus SuperHero",
        achievements: [],
        images: []
      },
      {
        company: "FlutterFlow Students Community India (FFSC India)",
        timeframe: "September 2025 - June 2026",
        role: "Volunteer",
        achievements: [],
        images: []
      },
      {
        company: "Google",
        timeframe: "August 2025 - January 2026",
        role: "Google Student Ambassador",
        achievements: [],
        images: []
      },
      {
        company: "GeeksforGeeks",
        timeframe: "April 2025 - Present",
        role: "Campus Mantri",
        achievements: [
          <>
            Serving as official campus ambassador, organizing technical workshops and promoting coding culture on campus.
          </>,
        ],
        images: []
      },
      {
        company: "SyncInfluence",
        timeframe: "January 2025 - February 2025",
        role: "Intern",
        achievements: [
          <>
            Enhanced and optimized 3 high-performance websites and landing pages with lazy loading, code-splitting, and responsive design, achieving 40% faster page load times and improved user experience.
          </>,
          <>
            Implemented scalable backend features with TypeScript, Node.js, MongoDB and Prisma ORM, and refactored existing Next.js and MEAN stack modules, resulting in a 15% increase in team productivity.
          </>,
        ],
        images: []
      },
      {
        company: "BITS APOGEE",
        timeframe: "January 2025 - Present",
        role: "Campus Ambassador",
        achievements: [
          <>
            Representing and promoting BITS Pilani's annual technical festival at campus level.
          </>,
        ],
        images: []
      },
      {
        company: "Zuno by foundit",
        timeframe: "January 2025 - Present",
        role: "Campus Ambassador",
        achievements: [
          <>
            Facilitating career opportunities and connecting students with industry resources.
          </>,
        ],
        images: []
      },
    ],
  },
  studies: {
    display: true,
    title: "Education",
    institutions: [
      {
        name: "RTU, Rajasthan",
        description: <>B.Tech Computer Science and Engineering      (2023-2027)</>,
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical skills",
    skills: [
      {
        title: "Languages & Tools",
        description: <>JavaScript, TypeScript, Rust, Go, Python, Java, HTML5, CSS3, SQL</>,
        images: []
      },
      {
        title: "Technologies & Frameworks",
        description: <>React, Next.js, Redux, Vue, Tailwind CSS, Node.js, Express, MongoDB, Prisma, WebSockets, JWT, Electron.js</>,
        images: []
      },
      {
        title: "DevOps & Cloud",
        description: <>Docker, Kubernetes, Prometheus, Grafana, Amazon Web Services (AWS), Git & GitHub, CI/CD</>,
        images: []
      },
    ],
  },
};

const blog = {
  path: "/blog",
  label: "Blog",
  title: `Blog – Web Development Notes by ${person.name}`,
  description: `Short, practical articles by ${person.name} on Next.js, React, TypeScript, Node.js, real-time apps, web performance, Rust and DevOps.`,
};

const work = {
  path: "/work",
  label: "Work",
  title: `Projects – Full Stack Work by ${person.name}`,
  description: `Case studies of full stack projects by ${person.name}: Python web crawler and data pipeline, real-time interview platform, AI voice agent, chat app, crypto wallet, stock dashboard and AI image generator.`,
  projects: [
    {
      title: "Interview Platform with Code Editor",
      slug: "interview-platform",
      description: "Architected a real-time interview platform (Next.js, Stream, Clerk, Convex) with live coding, video conferencing, and user authentication, improving interview completion rates by 15%. Built a secure, serverless data management system (Convex) for the interview platform, enabling efficient CRUD operations with real-time updates, ensuring data integrity.",
      technologies: ["Next.js", "TypeScript", "Stream", "Convex", "Clerk"],
      link: "https://github.com/PURVIK-31/interview-site",
      featured: true,
      image: "/images/projects/interview-site.png"
    },
    {
      title: "Real-time Stock Analysis/Updates",
      slug: "stock-analysis",
      description: "Engineered a real-time stock dashboard (Python, Streamlit, Plotly) with interactive UI for customizing charts, time periods, and real-time monitoring. Added multiple technical indicators (SMA 20, EMA 20, RSI 14) for advanced analytics. Deployed the stock app on Streamlit.",
      technologies: ["Python", "Streamlit", "Plotly", "yfinance"],
      link: "https://github.com/PURVIK-31/stock-analysis",
      featured: true,
      image: "/images/projects/stock-analysis.png"
    },
    {
      title: "Real-time Chat Application",
      slug: "chat-application",
      description: "Developed comprehensive chat features, including one-to-one and group messaging using React, leading to a 50% reduction in average response time for customer inquiries. Integrated Cloudinary for secure image storage and JWT-based authentication, bolstering data protection. Enhanced overall user satisfaction and engagement across the platform.",
      technologies: ["React.js", "MongoDB", "Socket.io", "Node.js", "Cloudinary"],
      link: "https://github.com/PURVIK-31/chat-app",
      featured: true,
      image: "/images/projects/chat-app.png"
    },
    {
      title: "Web-Based Cryptocurrency Wallet",
      slug: "web-wallet-cryptocurrency",
      description: "Developed a client-side cryptocurrency wallet supporting multiple blockchains (Ethereum and Solana) with a single seed phrase using hierarchical deterministic wallet principles, with all cryptographic operations running locally for maximum security.",
      technologies: ["React", "TypeScript", "bip39", "ethers.js", "@solana/web3.js", "TailwindCSS"],
      link: "https://github.com/PURVIK-31/Web-wallet-react",
      featured: true,
      image: "/images/projects/web-wallet.png"
    }
  ]
};

const gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Gallery – ${person.name}`,
  description: `Photo gallery by ${person.name}`,
  images: [
    {
      src: "/images/gallery/image1.jpg",
      alt: "Gallery image 1",
      orientation: "horizontal"
    },
    {
      src: "/images/gallery/image2.jpg",
      alt: "Gallery image 2",
      orientation: "vertical"
    },
    {
      src: "/images/gallery/image3.jpg",
      alt: "Gallery image 3",
      orientation: "horizontal"
    }
  ]
};

export { person, social, newsletter, home, about, blog, work, gallery };
