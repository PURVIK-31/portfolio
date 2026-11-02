import { Column, Heading, Text } from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { about, person, work } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";
import { Projects } from "@/components/work/Projects";
import { getSortedPosts } from "@/app/utils/utils";

export async function generateMetadata() {
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(work.title)}`,
    path: work.path,
  });
}

export default function Work() {
  const projects = getSortedPosts(["src", "app", "work", "projects"]);

  return (
    <Column maxWidth="m" fillWidth>
      <Schema
        as="collectionPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={`${baseURL}/og?title=${encodeURIComponent(work.title)}`}
        breadcrumbs={[{ name: "Projects", path: work.path }]}
        extra={{
          mainEntity: {
            "@type": "ItemList",
            itemListElement: projects.map((project, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${baseURL}/work/${project.slug}`,
              name: project.metadata.title,
            })),
          },
        }}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column gap="16" marginBottom="40" paddingX="l">
        <Heading as="h1" variant="display-strong-s" wrap="balance">
          Projects &amp; case studies
        </Heading>
        <Text variant="heading-default-l" onBackground="neutral-weak" wrap="balance">
          Real-time platforms, AI tools, Web3 and data dashboards — built end to end, from UI to backend and
          deployment.
        </Text>
      </Column>
      <Projects />
    </Column>
  );
}
