import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type Metadata = {
  title: string;
  publishedAt: string;
  updatedAt?: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  tags: string[];
  team: Team[];
  link?: string;
  demoLink?: string;
  faq: { question: string; answer: string }[];
};

export type Post = {
  metadata: Metadata;
  slug: string;
  content: string;
  readingTime: number;
};

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    notFound();
  }
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readingTimeOf(content: string) {
  const words = content.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);
  const tags: string[] = Array.isArray(data.tags) ? data.tags : data.tag ? [data.tag] : [];

  const metadata: Metadata = {
    title: data.title || "",
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt || data.publishedAt,
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || tags[0] || "",
    tags,
    team: data.team || [],
    link: data.link || "",
    demoLink: data.demoLink || "",
    faq: data.faq || [],
  };

  return { metadata, content, readingTime: readingTimeOf(content) };
}

function getMDXData(dir: string): Post[] {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content, readingTime } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));
    return { metadata, slug, content, readingTime };
  });
}

export function getPosts(customPath = ["", "", "", ""]) {
  const postsDir = path.join(process.cwd(), ...customPath);
  return getMDXData(postsDir);
}

export function getSortedPosts(customPath: string[]) {
  return getPosts(customPath).sort(
    (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
  );
}
