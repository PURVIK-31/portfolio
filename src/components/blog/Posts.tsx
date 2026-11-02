import { getSortedPosts } from "@/app/utils/utils";
import { Grid } from "@/once-ui/components";
import Post from "./Post";

interface PostsProps {
  range?: [number] | [number, number];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
  direction?: "row" | "column";
  showSummary?: boolean;
  exclude?: string[];
  tags?: string[];
}

export function Posts({
  range,
  columns = "1",
  thumbnail = false,
  direction,
  showSummary = false,
  exclude = [],
  tags,
}: PostsProps) {
  let sortedBlogs = getSortedPosts(["src", "app", "blog", "posts"]).filter(
    (post) => !exclude.includes(post.slug),
  );

  if (tags?.length) {
    // Related posts: shared tags first, then most recent
    const score = (t: string[]) => t.filter((tag) => tags.includes(tag)).length;
    sortedBlogs = [...sortedBlogs].sort((a, b) => score(b.metadata.tags) - score(a.metadata.tags));
  }

  const displayedBlogs = range
    ? sortedBlogs.slice(range[0] - 1, range.length === 2 ? range[1] : sortedBlogs.length)
    : sortedBlogs;

  return (
    <>
      {displayedBlogs.length > 0 && (
        <Grid columns={columns} mobileColumns="1" fillWidth marginBottom="40" gap="16">
          {displayedBlogs.map((post) => (
            <Post
              key={post.slug}
              post={{
                slug: post.slug,
                readingTime: post.readingTime,
                metadata: post.metadata,
              }}
              thumbnail={thumbnail}
              direction={direction}
              showSummary={showSummary}
            />
          ))}
        </Grid>
      )}
    </>
  );
}
