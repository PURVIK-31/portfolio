import { Metadata as NextMetadata } from "next";

export interface MetaProps {
  title: string;
  description: string;
  baseURL: string;
  path?: string;
  type?: "website" | "article" | "profile";
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  keywords?: string[];
  author?: {
    name: string;
    url?: string;
  };
}

export function generateMetadata({
  title,
  description,
  baseURL,
  path = "",
  type = "website",
  image,
  publishedTime,
  modifiedTime,
  tags,
  keywords,
  author,
}: MetaProps): NextMetadata {
  const normalizedBaseURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
  const normalizedPath = path === "/" || path === "" ? "" : path.startsWith("/") ? path : `/${path}`;

  const isFullUrl = (url: string) => /^https?:\/\//.test(url);

  const ogImage = image
    ? isFullUrl(image)
      ? image
      : `${normalizedBaseURL}${image.startsWith("/") ? image : `/${image}`}`
    : `${normalizedBaseURL}/og?title=${encodeURIComponent(title)}`;

  const url = `${normalizedBaseURL}${normalizedPath}`;

  return {
    title,
    description,
    ...(keywords || tags ? { keywords: [...(keywords || []), ...(tags || [])] } : {}),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type,
      url,
      siteName: "Purvik Sharma",
      locale: "en_IN",
      ...(type === "article"
        ? {
            ...(publishedTime ? { publishedTime } : {}),
            ...(modifiedTime ? { modifiedTime } : {}),
            ...(tags ? { tags } : {}),
            ...(author ? { authors: [author.url || author.name] } : {}),
          }
        : {}),
      images: [
        {
          url: ogImage,
          width: 1920,
          height: 1080,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(author ? { authors: [{ name: author.name, url: author.url }] } : {}),
  };
}

export const Meta = {
  generate: generateMetadata,
};

export default Meta;
