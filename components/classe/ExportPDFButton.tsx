"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type Eleve = { id: string; name: string };
type Tache = { id: string; name: string };
type Assignment = { id: string; assignment_date: string; eleve_id: string; tache_id: string };

const TACHE_COLORS = [
  "#FF6B9D",
  "#4ECDC4",
  "#FFD93D",
  "#95E1D3",
  "#A8E6CF",
  "#FF8B94",
  "#C7CEEA",
];

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function ExportPDFButton({
  weekDates,
  eleves,
  taches,
  assignments,
  classeName,
}: {
  weekDates: Date[];
  eleves: Eleve[];
  taches: Tache[];
  assignments: Assignment[];
  classeName: string;
}) {
  const [exporting, setExporting] = useState(false);

  const getAssignment = (date: string, tacheId: string) =>
    assignments.find((a) => a.assignment_date === date && a.tache_id === tacheId);

  async function exportToPDF() {
    setExporting(true);

    // Créer le contenu HTML à exporter
    const container = document.createElement("div");
    container.style.width = "800px";
    container.style.padding = "20px";
    container.style.backgroundColor = "white";
    container.style.fontFamily = "Fredoka, Arial, sans-serif";

    // En-tête
    const header = document.createElement("div");
    header.style.textAlign = "center";
    header.style.marginBottom = "20px";
    header.innerHTML = `
      <h1 style="font-size: 28px; color: #667eea; margin-bottom: 10px;">
        École Chanoine-Joseph-Théorêt
      </h1>
      <h2 style="font-size: 22px; color: #4ECDC4;">
        Calendrier des tâches - ${classeName}
      </h2>
      <p style="font-size: 16px; color: #666;">
        Semaine du ${weekDates[0].toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} au ${weekDates[4].toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
      </p>
    `;
    container.appendChild(header);

    // Calendrier
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "20px";

    // En-tête du tableau
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const emptyCell = document.createElement("th");
    emptyCell.style.padding = "10px";
    emptyCell.style.border = "2px solid #667eea";
    emptyCell.style.backgroundColor = "#f5f5f5";
    emptyCell.textContent = "Tâches";
    headerRow.appendChild(emptyCell);

    weekDates.forEach((date) => {
      const th = document.createElement("th");
      th.style.padding = "10px";
      th.style.border = "2px solid #667eea";
      th.style.backgroundColor = "#667eea";
      th.style.color = "white";
      th.style.textAlign = "center";
      th.innerHTML = `
        <div>${date.toLocaleDateString("fr-FR", { weekday: "short" })}</div>
        <div style="font-size: 14px;">${date.getDate()}/${date.getMonth() + 1}</div>
      `;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Corps du tableau
    const tbody = document.createElement("tbody");
    taches.forEach((tache, tacheIndex) => {
      const row = document.createElement("tr");
      const tacheCell = document.createElement("td");
      tacheCell.style.padding = "10px";
      tacheCell.style.border = "2px solid #ddd";
      tacheCell.style.fontWeight = "bold";
      tacheCell.style.backgroundColor = TACHE_COLORS[tacheIndex % TACHE_COLORS.length];
      tacheCell.style.color = "white";
      tacheCell.textContent = tache.name;
      row.appendChild(tacheCell);

      weekDates.forEach((date) => {
        const dateKey = formatDate(date);
        const assign = getAssignment(dateKey, tache.id);
        const td = document.createElement("td");
        td.style.padding = "10px";
        td.style.border = "2px solid #ddd";
        td.style.textAlign = "center";
        td.textContent = assign ? eleves.find((e) => e.id === assign.eleve_id)?.name || "" : "";
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.appendChild(table);

    // Ajouter temporairement au DOM
    document.body.appendChild(container);

    // Convertir en canvas puis PDF
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`calendrier-${classeName}-${formatDate(weekDates[0])}.pdf`);

    // Nettoyer
    document.body.removeChild(container);
    setExporting(false);
  }

  return (
    <button
      onClick={exportToPDF}
      disabled={exporting}
      className="rounded-[12px] bg-[#FF6B9D] px-5 py-3 text-lg font-semibold text-white transition-transform hover:scale-105 disabled:opacity-50"
    >
      {exporting ? "Export..." : "📄 Export PDF"}
    </button>
  );
}
