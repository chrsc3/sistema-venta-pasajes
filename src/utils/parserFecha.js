function parseFecha(fecha) {
  const fechaObj = new Date(fecha);
  return {
    fecha: fechaObj.toISOString().split("T")[0],
    hora: fechaObj.toISOString().split("T")[1].split(".")[0],
  };
}

function revertirFecha(fechaObj) {
  return new Date(`${fechaObj.fecha}T${fechaObj.hora}`).toISOString();
}

export { parseFecha, revertirFecha };
