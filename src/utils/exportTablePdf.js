import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const getByPath = (obj, path) => {
  if (!obj || !path) return "";
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
      cur = cur[p];
    } else {
      return "";
    }
  }
  return cur ?? "";
};

export default function exportTablePdf({
  title = "Reporte",
  subtitle = "",
  columns = [], // [{ header, field?, mapper?, width? }]
  rows = [],
  fileName = "reporte.pdf",
  orientation = "landscape",
}) {
  const headerRow = columns.map((c) => ({
    text: c.header || "",
    style: "tableHeader",
  }));

  const bodyRows = rows.map((row) =>
    columns.map((c) => {
      const val =
        typeof c.mapper === "function"
          ? c.mapper(row)
          : getByPath(row, c.field);
      return { text: String(val ?? ""), style: "tableCell" };
    })
  );

  const docDefinition = {
    pageOrientation: orientation,
    pageMargins: [30, 40, 30, 40],
    content: [
      { text: title, style: "title" },
      subtitle
        ? { text: subtitle, style: "subtitle", margin: [0, 0, 0, 8] }
        : {},
      {
        table: {
          headerRows: 1,
          widths: columns.map((c) => c.width || "*"),
          body: [headerRow, ...bodyRows],
        },
        layout: {
          fillColor: (rowIndex, node, columnIndex) => {
            if (rowIndex === 0) return "#f1f3f5";
            return rowIndex % 2 === 0 ? null : "#fcfcfc";
          },
          hLineColor: "#e6e6e6",
          vLineColor: "#e6e6e6",
        },
      },
    ],
    styles: {
      title: {
        fontSize: 16,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 6],
      },
      subtitle: { fontSize: 10, color: "#555", alignment: "center" },
      tableHeader: { bold: true, fontSize: 10 },
      tableCell: { fontSize: 9 },
      footer: { fontSize: 8, color: "#666" },
    },
    footer: (currentPage, pageCount) => ({
      columns: [
        { text: `Generado: ${new Date().toLocaleString()}`, alignment: "left" },
        { text: `Página ${currentPage} de ${pageCount}`, alignment: "right" },
      ],
      margin: [30, 0, 30, 0],
      style: "footer",
    }),
    defaultStyle: { fontSize: 9 },
  };

  pdfMake.createPdf(docDefinition).download(fileName);
}
