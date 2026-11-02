import { getSortedPosts } from "@/app/utils/utils";
import { baseURL, person, social, about, home } from "@/app/resources";

export const dynamic = "force-static";

// llms.txt (https://llmstxt.org): a plain-markdown summary of the site for LLMs / AI answer engines.
export function GET() {
  const projects = getSortedPosts(["src", "app", "work", "projects"]);
  const posts = getSortedPosts(["src", "app", "blog", "posts"]);

  const body = `# ${person.name}

> ${person.bio}

- Role: ${person.role}
- Location: ${person.city}, ${person.region}, ${person.country}
- Education: B.Tech Computer Science and Engineering, ${person.alumniOf} (2023–2027)
- Status: ${home.availability}
- Contact: ${person.email}
- Profiles: ${social
    .filter((s) => s.link.startsWith("http"))
    .map((s) => `[${s.name}](${s.link})`)
    .join(", ")}

## Experience

${about.work.experiences.map((e) => `- ${e.role}, ${e.company} (${e.timeframe})`).join("\n")}

## Skills

${person.knowsAbout.join(", ")}

## Projects

${projects.map((p) => `- [${p.metadata.title}](${baseURL}/work/${p.slug}): ${p.metadata.summary}`).join("\n")}

## Blog

${posts.map((p) => `- [${p.metadata.title}](${baseURL}/blog/${p.slug}): ${p.metadata.summary}`).join("\n")}

## FAQ

${home.faq.map((f) => `### ${f.question}\n${f.answer}`).join("\n\n")}

## Optional

- [About](${baseURL}/about)
- [Sitemap](${baseURL}/sitemap.xml)
- [RSS](${baseURL}/rss.xml)
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
