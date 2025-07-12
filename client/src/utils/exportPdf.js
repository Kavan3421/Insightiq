import jsPDF from "jspdf";

export const exportSummaryToPDF = (metrics, summary) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("📊 InsightIQ Analytics Report", 20, 20);

  // Metrics Section
  doc.setFontSize(14);
  doc.text("Metrics Overview:", 20, 35);

  metrics.forEach((metric, index) => {
    doc.text(`${metric.name}: ${metric.value}`, 20, 45 + index * 10);
  });

  // Summary Section
  const yOffset = 45 + metrics.length * 10 + 10;
  doc.setFontSize(14);
  doc.text("AI Summary:", 20, yOffset);

  doc.setFontSize(12);
  const wrappedSummary = doc.splitTextToSize(summary, 170);
  doc.text(wrappedSummary, 20, yOffset + 10);

  // Save as PDF
  doc.save("InsightIQ_Report.pdf");
};
