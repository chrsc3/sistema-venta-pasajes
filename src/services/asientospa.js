import axios from "axios";
const baseUrl = "/api/asientospa";
let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};
const getbyviajes = (idViaje) => {
  const request = axios.get(`${baseUrl}/${idViaje}`);
  return request.then((response) => response.data);
};

const update = async (id, idViaje, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}/${idViaje}`, newObject);
  return response.data;
};

export default { getAll, getbyviajes, update, setToken };
