import prisma from "@/lib/prisma";
import { BlogPostCardForm } from "./blog-post-card-form";

interface ParamsProps {
  params: {
    id: string;
  };
}

export default async function BlogPostCardRoute(props: Readonly<ParamsProps>) {
  const params = await props?.params;
  const { id } = params;
  const data = await prisma.posts.findFirst({
    where: {
      id: id,
    },
  });

  if (data === null) return <p>No Items Found</p>;

  return <BlogPostCardForm item={data} />;
}