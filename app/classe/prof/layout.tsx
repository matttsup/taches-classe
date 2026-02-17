import { createClient } from "@/lib/supabase/server";
import { getActiveClasse, getOrCreateFirstClasse, getOrCreateFirstProf } from "@/lib/classe-active";
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
    <div className="min-h-screen bg-classe-mint/30">
      <ClasseNavbar
        classes={classes}
        activeClasseId={classe?.id ?? null}
      />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
