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

export default async function exportPDF(dashboardRef, title) {
  const element = dashboardRef.current;
  if (!element) return;

  // Scroll to top and wait for rendering
  window.scrollTo(0, 0);
  await new Promise((res) => setTimeout(res, 500)); // wait for charts to load

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true, // ensure cross-origin images work
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // Add first page
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Add more pages if needed
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(`${title}.pdf`);
}