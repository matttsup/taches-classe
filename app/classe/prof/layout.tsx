import { createClient } from "@/lib/supabase/server";
import { getOrCreateFirstClasse, getOrCreateFirstProf } from "@/lib/classe-active";
import { ClasseNavbar } from "@/components/classe/ClasseNavbar";

export default async function ClasseProfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    console.error('[DEBUG] ClasseProfLayout START');
    const supabase = await createClient();
    console.error('[DEBUG] Supabase client obtained');
    
    const prof = await getOrCreateFirstProf(supabase);
    console.error('[DEBUG] Prof obtained:', prof.id);
    
    const { classe, classes } = await getOrCreateFirstClasse(supabase, prof.id);
    console.error('[DEBUG] Classe obtained:', classe?.id, 'Total classes:', classes.length);

    return (
      <div className="min-h-screen bg-[#F0F2F5] p-5">
        <ClasseNavbar classes={classes} activeClasseId={classe?.id ?? null} />
        <main className="mx-auto max-w-[1400px]">{children}</main>
      </div>
    );
  } catch (error) {
    console.error('[DEBUG] EXCEPTION in ClasseProfLayout:', error);
    throw error;
  }
}
