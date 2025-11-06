import axios from "axios";
const baseUrl = "/api/pagos";
let token = null;

export const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

export const crearPago = async ({
  monto,
  metodo,
  Boletos_idBoleto,
  Usuarios_idUsuario,
}) => {
  const config = {
    headers: { Authorization: token },
  };
  const body = { monto, metodo, Boletos_idBoleto, Usuarios_idUsuario };
  const response = await axios.post(baseUrl, body, config);
  return response.data;
};

export const listarPagos = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

export const listarPagosPorBoleto = async (idBoleto) => {
  const response = await axios.get(`${baseUrl}/boleto/${idBoleto}`);
  return response.data;
};

export default { setToken, crearPago, listarPagos, listarPagosPorBoleto };
