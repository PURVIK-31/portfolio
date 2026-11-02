import React from "react";
import type { Metadata } from "next";

import {
  Heading,
  Flex,
  Text,
  Button,
  Avatar,
  RevealFx,
  Column,
  Icon,
  Row,
  Tag,
  Grid,
  SmartLink,
} from "@/once-ui/components";
import { Projects } from "@/components/work/Projects";

import { baseURL, routes } from "@/app/resources";
import { home, about, person, newsletter, social, work, blog } from "@/app/resources/content";
import { faqSchema } from "@/app/resources/schema";
import { Mailchimp } from "@/components";
import { Posts } from "@/components/blog/Posts";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { RotatingWord } from "@/components/hero/RotatingWord";
import { TerminalIntro } from "@/components/hero/TerminalIntro";
import { JsonLd, Meta, Schema } from "@/once-ui/modules";
import styles from "./home.module.scss";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...Meta.generate({
      title: home.title,
      description: home.description,
      baseURL: baseURL,
      path: home.path,
    }),
    title: { absolute: home.title },
  };
}

function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <Flex fillWidth horizontal="space-between" vertical="end" gap="16" paddingX="l" mobileDirection="column">
      <Column gap="8">
        <Text variant="label-default-s" onBackground="brand-weak" className={styles.eyebrow}>
          {eyebrow}
        </Text>
        <Heading as="h2" variant="display-strong-xs" wrap="balance">
          {title}
        </Heading>
      </Column>
      {href && (
        <SmartLink href={href} suffixIcon="arrowRight" style={{ margin: 0 }}>
          <Text variant="body-default-s">{linkLabel}</Text>
        </SmartLink>
      )}
    </Flex>
  );
}

export default function Home() {
  const github = social.find((s) => s.name === "GitHub");
  const linkedin = social.find((s) => s.name === "LinkedIn");

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Schema
        as="profilePage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`${baseURL}/og?title=${encodeURIComponent(person.name)}`}
        extra={{ mainEntity: { "@id": `${baseURL}/#person` } }}
      />
      <JsonLd id="schema-faq-home" data={faqSchema(home.faq)} />

      {/* Hero */}
      <Flex
        fillWidth
        paddingY="24"
        gap="l"
        paddingX="l"
        as="section"
        aria-labelledby="hero-title"
        vertical="center"
        mobileDirection="column"
        className={styles.hero}
      >
        <Column flex={6} gap="0" className={styles.heroText}>
          {/* Terminal intro: who I am + availability + latest project, in one element */}
          <RevealFx fillWidth horizontal="start" paddingTop="8" paddingBottom="32">
            <TerminalIntro
              name={person.name}
              role={person.role}
              status={home.statusShort}
              latest={home.featured.display ? { title: home.featured.title, href: home.featured.href } : undefined}
            />
          </RevealFx>

          <RevealFx translateY="4" fillWidth horizontal="start" paddingBottom="20">
            <h1 id="hero-title" className={styles.h1}>
              <span className={styles.headline}>
                I build <RotatingWord words={home.headlineWords} /> web apps people love to use.
              </span>
            </h1>
          </RevealFx>

          <RevealFx translateY="8" delay={0.15} fillWidth horizontal="start" paddingBottom="24">
            <Text onBackground="neutral-weak" variant="heading-default-l" className={styles.subline}>
              {home.subline}
            </Text>
          </RevealFx>

          {/* Quick facts */}
          <RevealFx translateY="8" delay={0.25} fillWidth horizontal="start" paddingBottom="32">
            <Flex gap="20" wrap vertical="center" className={styles.facts}>
              <Row gap="8" vertical="center">
                <Icon name="mapPin" size="s" onBackground="brand-weak" />
                <Text variant="body-default-s" onBackground="neutral-medium">
                  {person.city}, {person.country}
                </Text>
              </Row>
              <Row gap="8" vertical="center">
                <Icon name="book" size="s" onBackground="brand-weak" />
                <Text variant="body-default-s" onBackground="neutral-medium">
                  B.Tech CSE · RTU &apos;27
                </Text>
              </Row>
            </Flex>
          </RevealFx>
          <RevealFx translateY="8" delay={0.3} horizontal="start">
            <Flex gap="12" wrap vertical="center" data-border="rounded">
              <Button href={work.path} variant="primary" size="m" suffixIcon="arrowRight">
                View my work
              </Button>
              <Button href={`mailto:${person.email}`} variant="secondary" size="m" prefixIcon="email">
                Get in touch
              </Button>
              <Button id="about" href={about.path} variant="tertiary" size="m">
                <Flex gap="8" vertical="center">
                  {about.avatar.display && (
                    <Avatar style={{ marginLeft: "-0.5rem" }} src={person.avatar} size="s" />
                  )}
                  More about me
                </Flex>
              </Button>
            </Flex>
          </RevealFx>
        </Column>
        <Flex flex={5} fillWidth className={styles.heroVisual}>
          <HeroVisual />
        </Flex>
      </Flex>

      {/* What I do */}
      <Column fillWidth gap="l" as="section" aria-labelledby="services-title">
        <Column gap="8" paddingX="l">
          <Text variant="label-default-s" onBackground="brand-weak" className={styles.eyebrow}>
            What I do
          </Text>
          <Heading id="services-title" as="h2" variant="display-strong-xs" wrap="balance">
            From pixels to production
          </Heading>
        </Column>
        <Grid columns="3" mobileColumns="1" gap="16" fillWidth paddingX="l">
          {home.services.map((service, i) => (
            <Column
              key={service.title}
              className={styles.card}
              padding="24"
              radius="l"
              border="neutral-alpha-weak"
              background="surface"
              gap="12"
            >
              <Text variant="code-default-s" onBackground="brand-weak">
                {String(i + 1).padStart(2, "0")} {"//"}
              </Text>
              <Heading as="h3" variant="heading-strong-l">
                {service.title}
              </Heading>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {service.description}
              </Text>
              <Flex gap="8" wrap paddingTop="4">
                {service.tools.map((tool) => (
                  <Tag key={tool} label={tool} size="s" variant="neutral" />
                ))}
              </Flex>
            </Column>
          ))}
        </Grid>
      </Column>

      {/* Featured project */}
      <Column fillWidth gap="l" as="section" aria-label="Featured project">
        <SectionHeader eyebrow="Featured work" title="Selected projects" href={work.path} linkLabel="All projects" />
        <RevealFx translateY="16" delay={0.5}>
          <Projects range={[1, 1]} />
        </RevealFx>
      </Column>

      {/* Blog */}
      {routes["/blog"] && (
        <Column fillWidth gap="l" as="section" aria-label="Latest blog posts">
          <SectionHeader eyebrow="Writing" title="Latest from the blog" href={blog.path} linkLabel="Read all posts" />
          <Flex fillWidth paddingX="l">
            <Posts range={[1, 4]} columns="2" showSummary />
          </Flex>
        </Column>
      )}

      {/* More projects */}
      <Column fillWidth gap="l" as="section" aria-label="More projects">
        <SectionHeader eyebrow="More work" title="Other things I've built" />
        <Projects range={[2, 4]} />
        <Flex fillWidth horizontal="center">
          <Button href={work.path} variant="secondary" size="m" suffixIcon="arrowRight" data-border="rounded">
            See all projects
          </Button>
        </Flex>
      </Column>

      {/* FAQ – visible answers that mirror the FAQPage JSON-LD */}
      <Column fillWidth gap="l" as="section" aria-labelledby="faq-title">
        <Column gap="8" paddingX="l">
          <Text variant="label-default-s" onBackground="brand-weak" className={styles.eyebrow}>
            FAQ
          </Text>
          <Heading id="faq-title" as="h2" variant="display-strong-xs">
            Quick answers
          </Heading>
        </Column>
        <Grid columns="2" mobileColumns="1" gap="16" fillWidth paddingX="l">
          {home.faq.map((item) => (
            <Column
              key={item.question}
              className={styles.card}
              padding="24"
              radius="l"
              border="neutral-alpha-weak"
              background="surface"
              gap="8"
            >
              <Heading as="h3" variant="heading-strong-m">
                {item.question}
              </Heading>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {item.answer}
              </Text>
            </Column>
          ))}
        </Grid>
      </Column>

      {/* Contact CTA */}
      <Column fillWidth paddingX="l" as="section" aria-labelledby="contact-title">
        <Column
          className={styles.cta}
          fillWidth
          padding="xl"
          radius="xl"
          border="brand-alpha-medium"
          gap="16"
          horizontal="center"
          align="center"
        >
          <Heading id="contact-title" as="h2" variant="display-strong-s" wrap="balance" align="center">
            Have a project, role or idea in mind?
          </Heading>
          <Text variant="body-default-l" onBackground="neutral-weak" wrap="balance" align="center">
            I'm {home.availability.toLowerCase()}. Drop me a line — I usually reply within a day.
          </Text>
          <Flex gap="12" wrap horizontal="center" paddingTop="8" data-border="rounded">
            <Button href={`mailto:${person.email}`} variant="primary" size="m" prefixIcon="email">
              {person.email}
            </Button>
            {linkedin && (
              <Button href={linkedin.link} variant="secondary" size="m" prefixIcon="linkedin">
                LinkedIn
              </Button>
            )}
            {github && (
              <Button href={github.link} variant="secondary" size="m" prefixIcon="github">
                GitHub
              </Button>
            )}
          </Flex>
        </Column>
      </Column>

      {newsletter.display && <Mailchimp newsletter={newsletter} />}
    </Column>
  );
}
