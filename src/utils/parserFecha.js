function parseFecha(fecha) {
  // Si la fecha viene en formato "YYYY-MM-DD HH:mm:ss", separar directamente
  if (typeof fecha === "string" && fecha.includes(" ")) {
    const [fechaParte, horaParte] = fecha.split(" ");
    return {
      fecha: fechaParte,
      hora: horaParte,
    };
  }

  // Si viene en formato ISO u otro formato, usar Date
  const fechaObj = new Date(fecha);

  // Usar métodos locales en lugar de ISO para evitar conversión a UTC
  const year = fechaObj.getFullYear();
  const month = String(fechaObj.getMonth() + 1).padStart(2, "0");
  const day = String(fechaObj.getDate()).padStart(2, "0");
  const hours = String(fechaObj.getHours()).padStart(2, "0");
  const minutes = String(fechaObj.getMinutes()).padStart(2, "0");
  const seconds = String(fechaObj.getSeconds()).padStart(2, "0");

  return {
    fecha: `${year}-${month}-${day}`,
    hora: `${hours}:${minutes}:${seconds}`,
  };
}

function revertirFecha(fechaObj) {
  return `${fechaObj.fecha} ${fechaObj.hora}`;
}

export { parseFecha, revertirFecha };
