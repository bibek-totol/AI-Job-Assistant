import InterviewEntry from "@/components/InterviewEntry";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Interview Session #${id}`,
    description: `Join your AI-powered interview session #${id}.`,
  };
}

export default async function InterviewEntryPage({ params }: Props) {
  const { id } = await params;
  return (
    <InterviewEntry id={id}/>
  );
}
