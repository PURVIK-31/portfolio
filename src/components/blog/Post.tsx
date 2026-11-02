import { Column, Flex, Heading, Row, SmartImage, SmartLink, Tag, Text } from "@/once-ui/components";
import styles from "./Posts.module.scss";
import { formatDate } from "@/app/utils/formatDate";

interface PostProps {
  post: {
    slug: string;
    readingTime: number;
    metadata: {
      title: string;
      summary: string;
      publishedAt: string;
      image?: string;
      tag?: string;
      tags: string[];
    };
  };
  thumbnail: boolean;
  direction?: "row" | "column";
  showSummary?: boolean;
}

export default function Post({ post, thumbnail, direction, showSummary = false }: PostProps) {
  const tags = post.metadata.tags.length ? post.metadata.tags : post.metadata.tag ? [post.metadata.tag] : [];

  return (
    <SmartLink
      fillWidth
      unstyled
      style={{ borderRadius: "var(--radius-l)", height: "100%" }}
      href={`/blog/${post.slug}`}
    >
      <Flex
        position="relative"
        direction={direction}
        radius="l"
        className={styles.hover}
        mobileDirection="column"
        fillWidth
      >
        {post.metadata.image && thumbnail && (
          <SmartImage
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 640px"
            border="neutral-alpha-weak"
            cursor="interactive"
            radius="l"
            src={post.metadata.image}
            alt={"Thumbnail of " + post.metadata.title}
            aspectRatio="16 / 9"
          />
        )}
        <Column position="relative" fillWidth gap="12" padding="24">
          <Row gap="8" vertical="center" wrap>
            <Text as="span" variant="label-default-s" onBackground="neutral-weak">
              <time dateTime={post.metadata.publishedAt}>{formatDate(post.metadata.publishedAt, false)}</time>
            </Text>
            <Text as="span" variant="label-default-s" onBackground="neutral-weak" aria-hidden="true">
              ·
            </Text>
            <Text as="span" variant="label-default-s" onBackground="neutral-weak">
              {post.readingTime} min read
            </Text>
          </Row>
          <Heading as="h3" variant="heading-strong-l" wrap="balance">
            {post.metadata.title}
          </Heading>
          {showSummary && post.metadata.summary && (
            <Text variant="body-default-s" onBackground="neutral-weak" className={styles.summary}>
              {post.metadata.summary}
            </Text>
          )}
          {tags.length > 0 && (
            <Flex gap="8" wrap paddingTop="4">
              {tags.slice(0, 3).map((tag) => (
                <Tag key={tag} label={tag} variant="neutral" size="s" />
              ))}
            </Flex>
          )}
        </Column>
      </Flex>
    </SmartLink>
  );
}
