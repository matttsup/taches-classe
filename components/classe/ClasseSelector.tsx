"use client";

import { useRouter, useSearchParams } from "next/navigation";

type ClasseRow = { id: string; name: string };

export function ClasseSelector({
  classes,
  selectedClasseId,
}: {
  classes: ClasseRow[];
  selectedClasseId: string;
}) {
  const router = useRouter();

  if (classes.length <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <label className="text-lg font-semibold text-gray-700">Changer de classe :</label>
      <select
        value={selectedClasseId}
        onChange={(e) => router.push(`/classe/prof?classe=${e.target.value}`)}
        className="rounded-[12px] border-2 border-classe-purple bg-white px-4 py-2 text-lg font-semibold text-classe-purple focus:outline-none focus:ring-2 focus:ring-classe-purple/30"
      >
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
