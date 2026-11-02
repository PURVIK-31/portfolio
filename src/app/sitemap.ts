import type { MetadataRoute } from "next";
import { getPosts } from "@/app/utils/utils";
import { baseURL, routes as routesConfig } from "@/app/resources";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getPosts(["src", "app", "blog", "posts"]);
  const works = getPosts(["src", "app", "work", "projects"]);

  const latest = (items: typeof blogs) =>
    items
      .map((p) => p.metadata.updatedAt || p.metadata.publishedAt)
      .sort()
      .at(-1);

  const blogEntries = blogs.map((post) => ({
    url: `${baseURL}/blog/${post.slug}`,
    lastModified: post.metadata.updatedAt || post.metadata.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const workEntries = works.map((post) => ({
    url: `${baseURL}/work/${post.slug}`,
    lastModified: post.metadata.updatedAt || post.metadata.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const lastModifiedFor: Record<string, string | undefined> = {
    "/blog": latest(blogs),
    "/work": latest(works),
  };

  const activeRoutes = Object.keys(routesConfig).filter(
    (route) => routesConfig[route as keyof typeof routesConfig],
  );

  const routeEntries = activeRoutes.map((route) => ({
    url: `${baseURL}${route !== "/" ? route : ""}`,
    lastModified: lastModifiedFor[route] || new Date().toISOString().split("T")[0],
    changeFrequency: route === "/" || route === "/blog" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "/" ? 1 : 0.9,
  }));

  return [...routeEntries, ...workEntries, ...blogEntries];
}
