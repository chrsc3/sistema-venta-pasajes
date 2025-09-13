import axios from "axios";
const baseUrl = "/api/dashboard";

const getDay = () => {
  const request = axios.get(`${baseUrl}/ventasDia`);
  return request.then((response) => {
    const data = response.data;
    return data;
  });
};

const getWeek = () => {
  const request = axios.get(`${baseUrl}/ventasSemana`);
  return request.then((response) => {
    const data = response.data;
    return data;
  });
};

const getMonth = () => {
  const request = axios.get(`${baseUrl}/ventasMes`);
  return request.then((response) => {
    const data = response.data;
    return data;
  });
};

const getStatistics = () => {
  const request = axios.get(`${baseUrl}/estadisticas`);
  return request.then((response) => {
    const data = response.data;
    return data;
  });
};

export default { getDay, getWeek, getMonth, getStatistics };
