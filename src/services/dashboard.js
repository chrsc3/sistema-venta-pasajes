import axios from "axios";
const baseUrl = "/api/dashboard";

const getDay = () => {
  const request = axios.get(`${baseUrl}/ventasDia`);
  return request.then((response) => {
    const data = response.data;
    return data;
  });
};

export default { getDay };
