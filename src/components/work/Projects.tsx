import { getSortedPosts } from "@/app/utils/utils";
import { Column } from "@/once-ui/components";
import { ProjectCard } from "@/components";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
}

export function Projects({ range, exclude = [] }: ProjectsProps) {
  const sortedProjects = getSortedPosts(["src", "app", "work", "projects"]).filter(
    (project) => !exclude.includes(project.slug),
  );

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      {displayedProjects.map((post, index) => (
        <ProjectCard
          priority={index < 1}
          key={post.slug}
          href={`/work/${post.slug}`}
          images={post.metadata.images}
          title={post.metadata.title}
          description={post.metadata.summary}
          content={post.content}
          tags={post.metadata.tags}
          link={post.metadata.link || ""}
        />
      ))}
    </Column>
  );
}
