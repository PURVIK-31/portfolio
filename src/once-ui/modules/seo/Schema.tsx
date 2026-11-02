import React from "react";

export interface SchemaProps {
  as:
    | "website"
    | "article"
    | "blog"
    | "blogPosting"
    | "techArticle"
    | "webPage"
    | "profilePage"
    | "collectionPage"
    | "creativeWork"
    | "organization";
  title: string;
  description: string;
  baseURL: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  keywords?: string[];
  wordCount?: number;
  /** Extra schema.org properties merged into the node */
  extra?: Record<string, unknown>;
  /** Breadcrumb trail, e.g. [{ name: "Blog", path: "/blog" }] (Home is added automatically) */
  breadcrumbs?: { name: string; path: string }[];
  author?: {
    name: string;
    url?: string;
    image?: string;
  };
}

const schemaTypeMap = {
  website: "WebSite",
  article: "Article",
  blog: "Blog",
  blogPosting: "BlogPosting",
  techArticle: "TechArticle",
  webPage: "WebPage",
  profilePage: "ProfilePage",
  collectionPage: "CollectionPage",
  creativeWork: "CreativeWork",
  organization: "Organization",
};

const isFullUrl = (url: string) => /^https?:\/\//.test(url);

/** Renders JSON-LD inline in the server HTML so every crawler (incl. AI crawlers that don't run JS) sees it. */
export function JsonLd({ data, id }: { data: Record<string, unknown>; id?: string }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      // Escape "<" so content can never close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function Schema({
  as,
  title,
  description,
  baseURL,
  path,
  datePublished,
  dateModified,
  image,
  keywords,
  wordCount,
  extra,
  breadcrumbs,
  author,
}: SchemaProps) {
  const normalizedBaseURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;

  const imageUrl = image
    ? isFullUrl(image)
      ? image
      : `${normalizedBaseURL}${image.startsWith("/") ? image : `/${image}`}`
    : `${normalizedBaseURL}/og?title=${encodeURIComponent(title)}`;

  const url = `${normalizedBaseURL}${normalizedPath}`;
  const personId = `${normalizedBaseURL}/#person`;

  const node: Record<string, unknown> = {
    "@type": schemaTypeMap[as],
    "@id": `${url}#${as}`,
    url,
    name: title,
    description,
    image: imageUrl,
    inLanguage: "en",
    isPartOf: { "@id": `${normalizedBaseURL}/#website` },
  };

  if (["article", "blogPosting", "techArticle"].includes(as)) {
    node.headline = title;
    node.mainEntityOfPage = { "@type": "WebPage", "@id": url };
    node.publisher = { "@id": personId };
  }

  if (datePublished) {
    node.datePublished = datePublished;
    node.dateModified = dateModified || datePublished;
  }
  if (keywords?.length) node.keywords = keywords.join(", ");
  if (wordCount) node.wordCount = wordCount;

  if (author) {
    node.author = {
      "@type": "Person",
      "@id": personId,
      name: author.name,
      ...(author.url && { url: author.url }),
      ...(author.image && { image: author.image }),
    };
  }

  Object.assign(node, extra);

  const graph: Record<string, unknown>[] = [node];

  if (breadcrumbs?.length) {
    const trail = [{ name: "Home", path: "/" }, ...breadcrumbs];
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: trail.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: `${normalizedBaseURL}${crumb.path === "/" ? "" : crumb.path}`,
      })),
    });
    node.breadcrumb = { "@id": `${url}#breadcrumb` };
  }

  return (
    <JsonLd id={`schema-${as}-${path}`} data={{ "@context": "https://schema.org", "@graph": graph }} />
  );
}

export default Schema;
