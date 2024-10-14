import createPdf from "./createDpf.js";
import LogoChaqueño from "../assets/LogoChaque.js"; // or .jpg, .svg, etc.

const generateTicket = async (output, boleto) => {
  const content = [
    //DATOS EMPRESA
    {
      image: LogoChaqueño,
      fit: [141.73, 56.692],
      alignment: "center",
    },
    { text: "EMPRESA DE TRANSPORTE", style: "header", margin: [0, 10, 0, 0] },
    { text: "CHACUEÑO S.A.", style: "header" },
    { text: "Terminal Bomidal,Santa Cruz", style: "header" },
    { text: "NIT 5661335013", style: "header" },

    //TIPO Y NUMERO DOCUMENTO
    { text: "BOLETO DE VIAJE", style: "header", margin: [0, 10, 0, 2.25] },
    {
      text: `BOLETO: ${boleto.idBoleto}`,
      style: "header",
      margin: [0, 2.25, 0, 0],
    },

    //DATOS BOLETO
    {
      margin: [0, 10, 0, 0],
      table: {
        widths: ["25%", "35%", "15%", "25%"],
        body: [
          [
            { text: "FECHA:", style: "tHeaderLabel" },
            {
              text: boleto.fecha.fecha,
              style: "tHeaderValue",
            },
            { text: "HORA:", style: "tHeaderLabel" },
            {
              text: boleto.fecha.hora,
              style: "tHeaderValue",
            },
          ],
          [
            { text: "NOMBRE:", style: "tHeaderLabel" },
            { text: boleto.nombre, style: "tHeaderValue", colSpan: 3 },
            {},
            {},
          ],
          [
            { text: "C.I.:", style: "tHeaderLabel" },
            { text: boleto.ci, style: "tHeaderValue", colSpan: 3 },
            {},
            {},
          ],
        ],
      },
      layout: "noBorders",
    },

    // TABLA DE DETALLES DEL BOLETO
    {
      margin: [0, 10, 0, 0],
      table: {
        widths: ["20%", "20%", "30%", "30%"],
        headerRows: boleto.detalle_boletos.length,
        body: [
          [
            {
              text: "N° ASIENTO",
              style: "tProductsHeader",
              alignment: "center",
            },
            { text: "NOMBRE", style: "tProductsHeader", alignment: "center" },
            { text: "C.I.", style: "tProductsHeader", alignment: "center" },
            { text: "PRECIO", style: "tProductsHeader", alignment: "right" },
          ],
          ...boleto.detalle_boletos.map((detalle) => [
            {
              text: detalle.numAsiento,
              style: "tProductsBody",
              alignment: "center",
            },
            {
              text: detalle.nombre,
              style: "tProductsBody",
              alignment: "center",
            },
            { text: detalle.ci, style: "tProductsBody", alignment: "center" },
            {
              text: detalle.precio + " Bs/",
              style: "tProductsBody",
              alignment: "right",
            },
          ]),
        ],
      },
      layout: "noBorders",
    },

    // TOTAL DEL BOLETO
    {
      margin: [0, 10, 0, 0],
      table: {
        widths: ["25%", "35%", "15%", "25%"],
        body: [
          [
            { text: "TOTAL: Bs/", style: "tTotals", colSpan: 2 },
            {},
            { text: boleto.total, style: "tTotals", colSpan: 2 },
            {},
          ],
        ],
      },
      layout: "noBorders",
    },

    // NOTA DE PIE
    {
      text: "Gracias por viajar con nosotros.",
      style: "text",
      alignment: "center",
      margin: [0, 10, 0, 0],
    },
  ];

  const response = await createPdf({ content }, output);
  return response;
};

export default generateTicket;
