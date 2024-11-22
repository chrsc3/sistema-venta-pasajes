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
const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response;
};

export default { getAll, getOne, create, remove, setToken };
