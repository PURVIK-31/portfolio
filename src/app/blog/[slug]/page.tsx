import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { getPosts } from "@/app/utils/utils";
import {
  Avatar,
  Button,
  Column,
  Flex,
  Heading,
  HeadingNav,
  Icon,
  Row,
  Tag,
  Text,
} from "@/once-ui/components";
import { about, blog, person, baseURL } from "@/app/resources";
import { formatDate } from "@/app/utils/formatDate";
import ScrollToHash from "@/components/ScrollToHash";
import { Posts } from "@/components/blog/Posts";
import { faqSchema } from "@/app/resources/schema";
import { Metadata } from "next";
import { JsonLd, Meta, Schema } from "@/once-ui/modules";
import styles from "./post.module.scss";

const POSTS_DIR = ["src", "app", "blog", "posts"];

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getPosts(POSTS_DIR).map((post) => ({ slug: post.slug }));
}

async function findPost(params: Promise<{ slug: string | string[] }>) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join("/") : routeParams.slug || "";
  return getPosts(POSTS_DIR).find((post) => post.slug === slugPath);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const post = await findPost(params);
  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    type: "article",
    publishedTime: post.metadata.publishedAt,
    modifiedTime: post.metadata.updatedAt,
    tags: post.metadata.tags,
    author: { name: person.name, url: `${baseURL}${about.path}` },
    image: post.metadata.image
      ? `${baseURL}${post.metadata.image}`
      : `${baseURL}/og?title=${encodeURIComponent(post.metadata.title)}`,
    path: `${blog.path}/${post.slug}`,
  });
}

export default async function Blog({ params }: { params: Promise<{ slug: string | string[] }> }) {
  const post = await findPost(params);

  if (!post) {
    notFound();
  }

  const wordCount = post.content.split(/\s+/).filter(Boolean).length;

  return (
    <Row fillWidth>
      <Row maxWidth={12} hide="m" />
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="xs" gap="l">
          <Schema
            as="blogPosting"
            baseURL={baseURL}
            path={`${blog.path}/${post.slug}`}
            title={post.metadata.title}
            description={post.metadata.summary}
            datePublished={post.metadata.publishedAt}
            dateModified={post.metadata.updatedAt}
            keywords={post.metadata.tags}
            wordCount={wordCount}
            image={`${baseURL}/og?title=${encodeURIComponent(post.metadata.title)}`}
            breadcrumbs={[
              { name: "Blog", path: blog.path },
              { name: post.metadata.title, path: `${blog.path}/${post.slug}` },
            ]}
            author={{
              name: person.name,
              url: `${baseURL}${about.path}`,
              image: `${baseURL}${person.avatar}`,
            }}
          />
          {post.metadata.faq.length > 0 && (
            <JsonLd id={`schema-faq-${post.slug}`} data={faqSchema(post.metadata.faq, `/blog/${post.slug}`)} />
          )}
          <Button data-border="rounded" href="/blog" weight="default" variant="tertiary" size="s" prefixIcon="chevronLeft">
            All posts
          </Button>
          <Column gap="16">
            <Heading as="h1" variant="display-strong-s" wrap="balance">
              {post.metadata.title}
            </Heading>
            <Row gap="12" vertical="center" wrap>
              <Avatar src={person.avatar} size="s" />
              <Text variant="body-default-s" onBackground="neutral-strong">
                {person.name}
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak" aria-hidden="true">
                ·
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                <time dateTime={post.metadata.publishedAt}>{formatDate(post.metadata.publishedAt)}</time>
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak" aria-hidden="true">
                ·
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {post.readingTime} min read
              </Text>
            </Row>
            {post.metadata.tags.length > 0 && (
              <Flex gap="8" wrap>
                {post.metadata.tags.map((tag) => (
                  <Tag key={tag} label={tag} size="s" variant="neutral" />
                ))}
              </Flex>
            )}
          </Column>

          {/* TL;DR: a direct, quotable answer near the top (AEO / featured snippets) */}
          {post.metadata.summary && (
            <Column className={styles.tldr} padding="20" radius="l" gap="8" as="aside" aria-label="Summary">
              <Text variant="label-strong-s" onBackground="brand-weak">
                TL;DR
              </Text>
              <Text variant="body-default-m">{post.metadata.summary}</Text>
            </Column>
          )}

          <Column as="article" fillWidth>
            <CustomMDX source={post.content} />
          </Column>

          {post.metadata.faq.length > 0 && (
            <Column gap="16" as="section" aria-labelledby="post-faq">
              <Heading as="h2" id="post-faq" variant="heading-strong-xl">
                FAQ
              </Heading>
              {post.metadata.faq.map((item) => (
                <Column key={item.question} gap="4">
                  <Heading as="h3" variant="heading-strong-m">
                    {item.question}
                  </Heading>
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    {item.answer}
                  </Text>
                </Column>
              ))}
            </Column>
          )}

          {/* Author box – E-E-A-T signal */}
          <Row className={styles.author} padding="20" radius="l" gap="16" vertical="center" mobileDirection="column">
            <Avatar src={person.avatar} size="l" />
            <Column gap="4" flex={1}>
              <Text variant="heading-strong-s">Written by {person.name}</Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {person.bio}
              </Text>
            </Column>
            <Button href={about.path} variant="secondary" size="s" data-border="rounded">
              About me
            </Button>
          </Row>

          <Column gap="16" as="section" aria-labelledby="related-posts" paddingTop="16">
            <Heading as="h2" id="related-posts" variant="heading-strong-xl">
              Keep reading
            </Heading>
            <Posts range={[1, 2]} columns="1" exclude={[post.slug]} tags={post.metadata.tags} />
          </Column>
          <ScrollToHash />
        </Column>
      </Row>
      <Column maxWidth={12} paddingLeft="40" fitHeight position="sticky" top="80" gap="16" hide="m">
        <Row gap="12" paddingLeft="2" vertical="center" onBackground="neutral-medium" textVariant="label-default-s">
          <Icon name="document" size="xs" />
          On this page
        </Row>
        <HeadingNav fitHeight />
      </Column>
    </Row>
  );
}
