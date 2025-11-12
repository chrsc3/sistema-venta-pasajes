import axios from "axios";
const baseUrl = "/api/viajes";
let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const normalizarLista = (data) => {
  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (item.fechaViaje) {
        const fechaViaje = new Date(item.fechaViaje);
        item.fechaViaje = {
          fecha: fechaViaje.toISOString().split("T")[0],
          hora: fechaViaje.toISOString().split("T")[1].split(".")[0],
        };
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
      const fechaViaje = new Date(data.fechaViaje);
      data.fechaViaje = {
        fecha: fechaViaje.toISOString().split("T")[0],
        hora: fechaViaje.toISOString().split("T")[1].split(".")[0],
      };
    }
    return data;
  });
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  const data = response.data;
  if (data && data.fechaViaje) {
    const fechaViaje = new Date(data.fechaViaje);
    data.fechaViaje = {
      fecha: fechaViaje.toISOString().split("T")[0],
      hora: fechaViaje.toISOString().split("T")[1].split(".")[0],
    };
  }
  return data;
};

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject);
  return response.data;
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
