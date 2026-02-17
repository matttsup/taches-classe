import { createClient } from "@/lib/supabase/server";
import { getOrCreateFirstClasse, getOrCreateFirstProf } from "@/lib/classe-active";
import { ClasseNavbar } from "@/components/classe/ClasseNavbar";

export default async function ClasseProfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const prof = await getOrCreateFirstProf(supabase);
  const { classe, classes } = await getOrCreateFirstClasse(supabase, prof.id);

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-5">
      <ClasseNavbar classes={classes} activeClasseId={classe?.id ?? null} />
      <main className="mx-auto max-w-[1400px]">{children}</main>
    </div>
  );
}
