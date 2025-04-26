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
  languages: ["English", "Hindi"],
};

const newsletter = {
  display: true,
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
    icon: "code",
    link: "https://leetcode.com/PURVIK-31/",
  },
  {
    name: "CodeStudio",
    icon: "code",
    link: "https://www.codingninjas.com/studio/profile/purvik31",
  },
];

const home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Building high-performance web experiences with MERN, Next.js, Python & Rust</>,
  featured: {
    display: true,
    title: <>Recent project: <strong className="ml-4">Interview Platform with Code Editor</strong></>,
    href: "/work/interview-platform",
  },
  subline: (
    <>
      I'm {person.firstName}, a full stack developer passionate about creating
      <br /> intuitive user interfaces and exceptional web experiences.
    </>
  ),
};

const about = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from Jaipur, India`,
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
        Purvik is a Jaipur-based full stack developer specializing in MERN, Next.js, Python and Rust. He builds modern, 
        responsive web applications with a focus on user experience and performance optimization, working across both 
        frontend and backend technologies to deliver complete solutions.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "SyncInfluence",
        timeframe: "January 2025 - February 2025",
        role: "Intern",
        achievements: [
          <>
            Enhanced and optimized 3 high-performance websites and landing pages with lazy loading, code-splitting, and responsive design, achieving 40% faster page load times and improved user experience.
          </>,
          <>
            Implemented scalable backend solutions with TypeScript, Node.js, MongoDB, and Prisma ORM, refactoring existing session or NEXT.js and the MEAN Stack for over 30 pairs, resulting in a 15% increase in team productivity.
          </>,
        ],
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
        description: <>B.Tech Computer Science and Engineering, SGPA - 9.12 (2023-2027)</>,
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical skills",
    skills: [
      {
        title: "Languages & Tools",
        description: <>JavaScript, TypeScript, Rust, GO, Python, Java, HTML5, CSS3, SQL</>,
        images: []
      },
      {
        title: "Technologies & Frameworks",
        description: <>React, Node.js, Express, Redux, Next.js, TypeScript, MongoDB, Tailwind, Docker, Kubernetes, Prometheus, Grafana, Amazon Web Services (AWS), Git/GitHub, AWS, Vue, WebSockets, JWT, Electron.js</>,
        images: []
      },
    ],
  },
};

const blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about Web Development and Technology",
  description: `Read what ${person.name} has been up to recently`,
  posts: [
    {
      title: "Getting Started with Rust for Web Developers",
      slug: "rust",
      shortSlug: "rust",
      date: "2025-04-27",
      description: "My journey learning Rust as a JavaScript developer and how it's changing my approach to programming. This guide covers the basics and explains why web developers should consider learning Rust.",
      tags: ["Rust", "Web Development", "Programming Languages"]
    },
    {
      title: "Building Cross-Platform Desktop Applications with Electron.js",
      slug: "electron",
      shortSlug: "electron",
      date: "2023-11-20",
      description: "A comprehensive guide to developing desktop applications using web technologies. Learn how to leverage your existing JavaScript skills to create native-like experiences across different operating systems.",
      tags: ["Electron.js", "JavaScript", "Desktop Applications", "Cross-Platform"]
    },
    {
      title: "Next.js 14 App Router: Practical Patterns and Best Practices",
      slug: "nextjs",
      shortSlug: "nextjs",
      date: "2023-10-10",
      description: "Exploring practical patterns for structuring Next.js applications using the App Router. This article covers server components, client components, and data fetching strategies for optimal performance.",
      tags: ["Next.js", "React", "Web Development", "Performance"]
    }
  ]
};

const work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Full Stack development projects by ${person.name}`,
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
