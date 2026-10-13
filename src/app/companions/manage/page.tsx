import { CharacterEditor } from "@/components/companions/CharacterEditor";
export default async function ManageCompanionPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return <CharacterEditor id={id} />;
}
