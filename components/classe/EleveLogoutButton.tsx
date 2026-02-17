"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function EleveLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
    >
      Déconnexion
    </button>
  );
}
