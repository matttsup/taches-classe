import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CompleteProfileForm } from "./CompleteProfileForm";

export default async function CompleteProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profile) {
    if (profile.role === "prof") redirect("/classe/prof");
    redirect("/classe/eleve");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow">
        <div className="text-center text-4xl">📋</div>
        <h1 className="text-2xl font-bold text-classe-green">
          Compléter votre profil
        </h1>
        <p className="text-gray-600">
          Indiquez votre nom et votre rôle (enseignant ou élève).
        </p>
        <CompleteProfileForm userEmail={user.email ?? ""} />
      </div>
    </main>
  );
}
