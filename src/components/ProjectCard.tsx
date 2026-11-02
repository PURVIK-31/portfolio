"use client";

import {
  Carousel,
  Column,
  Flex,
  Heading,
  SmartLink,
  Tag,
  Text,
} from "@/once-ui/components";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  tags?: string[];
  link: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  images = [],
  title,
  content,
  description,
  tags = [],
  link,
}) => {
  return (
    <Column fillWidth gap="m">
      <Carousel
        sizes="(max-width: 960px) 100vw, 960px"
        images={images.map((image) => ({
          src: image,
          alt: `Screenshot of ${title}`,
        }))}
      />
      <Flex
        mobileDirection="column"
        fillWidth
        paddingX="s"
        paddingTop="12"
        paddingBottom="24"
        gap="l"
      >
        {title && (
          <Flex flex={5}>
            <Heading as="h2" wrap="balance" variant="heading-strong-xl">
              {title}
            </Heading>
          </Flex>
        )}
        {(tags.length > 0 || description?.trim() || content?.trim()) && (
          <Column flex={7} gap="16">
            {description?.trim() && (
              <Text wrap="balance" variant="body-default-s" onBackground="neutral-weak">
                {description}
              </Text>
            )}
            {tags.length > 0 && (
              <Flex gap="8" wrap>
                {tags.slice(0, 5).map((tag) => (
                  <Tag key={tag} label={tag} size="s" variant="neutral" />
                ))}
              </Flex>
            )}
            <Flex gap="24" wrap>
              {content?.trim() && (
                <SmartLink
                  suffixIcon="arrowRight"
                  style={{ margin: "0", width: "fit-content" }}
                  href={href}
                >
                  <Text variant="body-default-s">Read case study</Text>
                </SmartLink>
              )}
              {link && (
                <SmartLink
                  suffixIcon="arrowUpRightFromSquare"
                  style={{ margin: "0", width: "fit-content" }}
                  href={link}
                >
                  <Text variant="body-default-s">Source code</Text>
                </SmartLink>
              )}
            </Flex>
          </Column>
        )}
      </Flex>
    </Column>
  );
};
