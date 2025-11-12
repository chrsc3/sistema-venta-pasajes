import axios from "axios";
const baseUrl = "/api/boletos";
let token = null;
import { parseFecha } from "../utils/parserFecha";

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => {
    const data = response.data.map((boleto) => {
      if (boleto && boleto.fecha) {
        boleto.fecha = parseFecha(boleto.fecha);
      }
      return boleto;
    });
    return data;
  });
};
const getOne = (id) => {
  const request = axios.get(`${baseUrl}/${id}`);
  return request.then((response) => {
    const data = response.data.map((boleto) => {
      if (boleto && boleto.fecha) {
        boleto.fecha = parseFecha(boleto.fecha);
      }
      return boleto;
    });
    return data;
  });
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const confirmarReserva = async (id, nuevoTotal = null) => {
  const config = {
    headers: { Authorization: token },
  };

  const data = nuevoTotal ? { total: nuevoTotal } : {};
  const response = await axios.patch(
    `${baseUrl}/${id}/confirmar`,
    data,
    config
  );
  return response.data;
};

const anularBoleto = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.patch(`${baseUrl}/${id}/anular`, {}, config);
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response;
};

export default {
  getAll,
  getOne,
  create,
  confirmarReserva,
  anularBoleto,
  remove,
  setToken,
};
