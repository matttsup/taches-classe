import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveClasse } from "@/lib/classe-active";
import { ClasseNavbar } from "@/components/classe/ClasseNavbar";

export default async function ClasseProfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.role !== "prof") redirect("/");

  const { data: prof } = await supabase
    .from("profs")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!prof) redirect("/complete-profile");

  const { classe, classes } = await getActiveClasse(supabase, prof.id);

  return (
    <div className="min-h-screen bg-classe-mint/30">
      <ClasseNavbar
        userName={profile.name}
        classes={classes}
        activeClasseId={classe?.id ?? null}
      />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
