import { getSortedPosts } from "@/app/utils/utils";
import { baseURL, blog, person } from "@/app/resources";

export const dynamic = "force-static";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const posts = getSortedPosts(["src", "app", "blog", "posts"]);

  const items = posts
    .map(
      (post) => `    <item>
      <title>${escape(post.metadata.title)}</title>
      <link>${baseURL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseURL}/blog/${post.slug}</guid>
      <description>${escape(post.metadata.summary)}</description>
      <pubDate>${new Date(post.metadata.publishedAt).toUTCString()}</pubDate>
${post.metadata.tags.map((t) => `      <category>${escape(t)}</category>`).join("\n")}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(blog.title)}</title>
    <link>${baseURL}/blog</link>
    <description>${escape(blog.description)}</description>
    <language>en</language>
    <managingEditor>${person.email} (${person.name})</managingEditor>
    <atom:link href="${baseURL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
