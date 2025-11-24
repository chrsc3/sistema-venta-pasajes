import axios from "axios";
import { parseFecha, revertirFecha } from "../utils/parserFecha";
const baseUrl = "/api/viajes";
let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

// Normaliza cada viaje reemplazando fechaViaje Date/String por objeto { fecha, hora }
const normalizarLista = (data) => {
  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (item.fechaViaje) {
        item.fechaViaje = parseFecha(item.fechaViaje);
      }
    });
  }
  return data;
};

// Viajes disponibles para ventas (futuros) - endpoint filtrado
const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => normalizarLista(response.data));
};

// Todos los viajes (incluye pasados) para administración/reportes
const getAllAdmin = () => {
  const request = axios.get(`${baseUrl}/all`);
  return request.then((response) => normalizarLista(response.data));
};

const getOne = (id) => {
  const request = axios.get(`${baseUrl}/${id}`);
  return request.then((response) => {
    const data = response.data;
    if (data && data.fechaViaje) {
      data.fechaViaje = parseFecha(data.fechaViaje);
    }
    return data;
  });
};

const create = async (newObject) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.post(baseUrl, newObject, config);
  const data = response.data;
  if (data && data.fechaViaje) {
    data.fechaViaje = parseFecha(data.fechaViaje);
  }
  return data;
};

const update = async (id, newObject) => {
  // Si vienen campos separados, consolidar antes de enviar
  let payload = { ...newObject };
  if (newObject.fechaViajeFecha && newObject.fechaViajeHora) {
    payload.fechaViaje = revertirFecha({
      fecha: newObject.fechaViajeFecha,
      hora: newObject.fechaViajeHora.length === 5
        ? `${newObject.fechaViajeHora}:00` // asegurar segundos
        : newObject.fechaViajeHora,
    });
    delete payload.fechaViajeFecha;
    delete payload.fechaViajeHora;
  }
  const response = await axios.put(`${baseUrl}/${id}`, payload);
  const data = response.data;
  if (data && data.fechaViaje) {
    data.fechaViaje = parseFecha(data.fechaViaje);
  }
  return data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  console.log(response);
  return response;
};

export default {
  getAll,
  getAllAdmin,
  create,
  update,
  remove,
  setToken,
  getOne,
};
