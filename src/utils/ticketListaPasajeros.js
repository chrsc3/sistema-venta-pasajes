import createPdf from "./createDpf.js";
import LogoChaqueño from "../assets/LogoChaque.js"; // or .jpg, .svg, etc.

const generateTicket = async (output, detalleBoletos) => {
  const content = [
    // TABLA DE DETALLES DEL BOLETO
    {
      image: LogoChaqueño,
      fit: [141.73, 56.692],
      alignment: "center",
    },
    { text: "EMPRESA DE TRANSPORTE", style: "header", margin: [0, 10, 0, 0] },
    { text: "CHAQUEÑO S.A.", style: "header" },
    { text: "Terminal Bomidal,Santa Cruz", style: "header" },
    { text: "NIT 5661335013", style: "header" },

    {
      table: {
        widths: ["50%", "50%"],
        headerRows: 1,
        body: [
          [
            { text: "NOMBRE", style: "tProductsHeader", alignment: "center" },
            { text: "C.I.", style: "tProductsHeader", alignment: "center" },
          ],
          ...detalleBoletos.map((detalle) => [
            {
              text: detalle.nombre,
              style: "tProductsBody",
              alignment: "center",
            },
            { text: detalle.ci, style: "tProductsBody", alignment: "center" },
          ]),
        ],
      },
      layout: "noBorders",
    },
  ];

  const response = await createPdf({ content }, output);
  return response;
};

export default generateTicket;
