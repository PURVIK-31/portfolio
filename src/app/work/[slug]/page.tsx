import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { getPosts } from "@/app/utils/utils";
import { Button, Column, Flex, Heading, SmartImage, Tag, Text } from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { about, person, work } from "@/app/resources/content";
import { formatDate } from "@/app/utils/formatDate";
import ScrollToHash from "@/components/ScrollToHash";
import { Projects } from "@/components/work/Projects";
import { Metadata } from "next";
import { Meta, Schema } from "@/once-ui/modules";

const PROJECTS_DIR = ["src", "app", "work", "projects"];

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getPosts(PROJECTS_DIR).map((post) => ({ slug: post.slug }));
}

async function findProject(params: Promise<{ slug: string | string[] }>) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join("/") : routeParams.slug || "";
  return getPosts(PROJECTS_DIR).find((post) => post.slug === slugPath);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const post = await findProject(params);
  if (!post) return {};

  return Meta.generate({
    title: `${post.metadata.title} – Case Study`,
    description: post.metadata.summary,
    baseURL: baseURL,
    type: "article",
    publishedTime: post.metadata.publishedAt,
    tags: post.metadata.tags,
    image: post.metadata.images[0] || `${baseURL}/og?title=${encodeURIComponent(post.metadata.title)}`,
    path: `${work.path}/${post.slug}`,
  });
}

export default async function Project({ params }: { params: Promise<{ slug: string | string[] }> }) {
  const post = await findProject(params);

  if (!post) {
    notFound();
  }

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <Schema
        as="creativeWork"
        baseURL={baseURL}
        path={`${work.path}/${post.slug}`}
        title={post.metadata.title}
        description={post.metadata.summary}
        datePublished={post.metadata.publishedAt}
        dateModified={post.metadata.updatedAt}
        keywords={post.metadata.tags}
        image={post.metadata.images[0] || `${baseURL}/og?title=${encodeURIComponent(post.metadata.title)}`}
        breadcrumbs={[
          { name: "Projects", path: work.path },
          { name: post.metadata.title, path: `${work.path}/${post.slug}` },
        ]}
        extra={{
          creator: { "@id": `${baseURL}/#person` },
          ...(post.metadata.link && { codeRepository: post.metadata.link, sameAs: post.metadata.link }),
        }}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column maxWidth="xs" gap="16" fillWidth>
        <Button data-border="rounded" href="/work" variant="tertiary" weight="default" size="s" prefixIcon="chevronLeft">
          All projects
        </Button>
        <Heading as="h1" variant="display-strong-s" wrap="balance">
          {post.metadata.title}
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          {post.metadata.summary}
        </Text>
        {post.metadata.tags.length > 0 && (
          <Flex gap="8" wrap>
            {post.metadata.tags.map((tag) => (
              <Tag key={tag} label={tag} size="s" variant="neutral" />
            ))}
          </Flex>
        )}
        {(post.metadata.link || post.metadata.demoLink) && (
          <Flex gap="12" wrap paddingTop="8" data-border="rounded">
            {post.metadata.demoLink && (
              <Button href={post.metadata.demoLink} variant="primary" size="s" suffixIcon="arrowUpRightFromSquare">
                Live demo
              </Button>
            )}
            {post.metadata.link && (
              <Button href={post.metadata.link} variant="secondary" size="s" prefixIcon="github">
                Source code
              </Button>
            )}
          </Flex>
        )}
      </Column>
      {post.metadata.images.length > 0 && (
        <SmartImage
          priority
          aspectRatio="16 / 9"
          radius="m"
          alt={`Screenshot of ${post.metadata.title}`}
          src={post.metadata.images[0]}
        />
      )}
      <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
        <Text variant="body-default-s" onBackground="neutral-weak" marginBottom="24">
          Built by {person.name} ·{" "}
          {post.metadata.publishedAt && (
            <time dateTime={post.metadata.publishedAt}>{formatDate(post.metadata.publishedAt)}</time>
          )}
        </Text>
        <CustomMDX source={post.content} />
      </Column>
      <Column fillWidth gap="l" paddingTop="40" as="section" aria-labelledby="more-projects">
        <Heading as="h2" id="more-projects" variant="display-strong-xs" paddingX="l">
          More projects
        </Heading>
        <Projects range={[1, 2]} exclude={[post.slug]} />
      </Column>
      <ScrollToHash />
    </Column>
  );
}
