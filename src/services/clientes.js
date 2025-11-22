import axios from "axios";
const baseUrl = "/api/clientes";
let token = null;

export const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const config = () => (token ? { headers: { Authorization: token } } : {});

export const getAll = async () => {
  const res = await axios.get(baseUrl, config());
  return res.data;
};

export const getOne = async (id) => {
  const res = await axios.get(`${baseUrl}/${id}`, config());
  return res.data;
};

export const create = async (obj) => {
  const res = await axios.post(baseUrl, obj, config());
  return res.data;
};

export const update = async (id, obj) => {
  const res = await axios.put(`${baseUrl}/${id}`, obj, config());
  return res.data;
};

export const remove = async (id) => {
  const res = await axios.delete(`${baseUrl}/${id}`, config());
  return res.data;
};

export default { getAll, getOne, create, update, remove, setToken };
