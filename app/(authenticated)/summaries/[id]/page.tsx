import prisma from "@/lib/prisma";
import { SummaryCardForm } from "./summary-card-form";

interface ParamsProps {
  params: {
    id: string;
  };
}

export default async function SummaryCardRoute(props: Readonly<ParamsProps>) {
  const params = await props?.params;
  const { id } = params;
  const data = await prisma.summaries.findFirst({
    where: {
      id: id,
    },
  });

  if (data === null) return <p>No Items Found</p>;

  return <SummaryCardForm item={data} />;
}