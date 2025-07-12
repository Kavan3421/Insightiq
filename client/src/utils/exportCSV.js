import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function exportToCSV(metrics) {
  const csv = [
    ["Name", "Value", "Category", "Date"],
    ...metrics.map((m) => [
      m.name,
      m.value,
      m.category,
      new Date(m.date).toLocaleString(),
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "metrics.csv";
  a.click();
}

export default async function exportPDF(dashboardRef) {
  const element = dashboardRef.current;
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("InsightIQ_Analysis_Report.pdf");
};
