import axios from "axios";
import { parseFecha } from "../utils/parserFecha";
const baseUrl = "/api/reportes";

const getVentasViaje = (idViaje) => {
  const request = axios.get(`${baseUrl}/viaje/${idViaje}`);
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
const getVentasEntreFechas = (fechaInicio, fechaFin) => {
  const request = axios.post(`${baseUrl}/fechas`, {
    fechaInicio,
    fechaFin,
  });
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

const getReporteViajes = (fechaInicio, fechaFin) => {
  const request = axios.post(`${baseUrl}/viajes`, {
    fechaInicio,
    fechaFin,
  });
  return request.then((response) => response.data);
};

const getReporteUsuarios = (fechaInicio, fechaFin) => {
  const request = axios.post(`${baseUrl}/usuarios`, {
    fechaInicio,
    fechaFin,
  });
  return request.then((response) => response.data);
};

export default {
  getVentasViaje,
  getVentasEntreFechas,
  getReporteViajes,
  getReporteUsuarios,
};
