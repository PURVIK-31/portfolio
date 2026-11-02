import { Column, Heading, Text, Flex, Button } from "@/once-ui/components";
import { Mailchimp } from "@/components";
import { Posts } from "@/components/blog/Posts";
import { baseURL } from "@/app/resources";
import { blog, person, newsletter, about } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";
import { getSortedPosts } from "@/app/utils/utils";

export async function generateMetadata() {
  return Meta.generate({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(blog.title)}`,
    path: blog.path,
  });
}

export default function Blog() {
  const posts = getSortedPosts(["src", "app", "blog", "posts"]);

  return (
    <Column maxWidth="m" fillWidth>
      <Schema
        as="blog"
        baseURL={baseURL}
        title={blog.title}
        description={blog.description}
        path={blog.path}
        image={`${baseURL}/og?title=${encodeURIComponent(blog.title)}`}
        breadcrumbs={[{ name: "Blog", path: blog.path }]}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
        extra={{
          blogPost: posts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.metadata.title,
            url: `${baseURL}/blog/${post.slug}`,
            datePublished: post.metadata.publishedAt,
          })),
        }}
      />
      <Column gap="16" marginBottom="40" paddingX="l">
        <Heading as="h1" variant="display-strong-s" wrap="balance">
          Notes on building for the web
        </Heading>
        <Text variant="heading-default-l" onBackground="neutral-weak" wrap="balance">
          Short, practical write-ups on Next.js, React, TypeScript, real-time apps, performance, Rust and
          DevOps — things I learned while shipping real projects.
        </Text>
        <Flex gap="12" paddingTop="8" data-border="rounded">
          <Button href="/rss.xml" variant="secondary" size="s" prefixIcon="rss">
            RSS feed
          </Button>
        </Flex>
      </Column>
      <Column fillWidth flex={1} paddingX="l">
        <Posts columns="2" showSummary />
      </Column>
      {newsletter.display && <Mailchimp newsletter={newsletter} />}
    </Column>
  );
}
