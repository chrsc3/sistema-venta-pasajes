import axios from "axios";
const baseUrl = "/api/boletos";
let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => {
    const data = response.data;
    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item.fecha) {
          const fecha = new Date(item.fecha);
          item.fecha = {
            fecha: fecha.toISOString().split("T")[0],
            hora: fecha.toISOString().split("T")[1].split(".")[0],
          };
        }
      });
    }
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

export default { getAll, create, setToken };
