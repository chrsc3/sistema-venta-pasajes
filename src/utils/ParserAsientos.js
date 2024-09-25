function parseAsientos(asientosStr) {
  const asientosArray = asientosStr.split(",").map(Number);
  return asientosArray.map((asiento, index) => ({
    id: index + 1,
    status: asiento,
  }));
}
function stringifyAsientos(asientos) {
  return asientos.map((asiento) => asiento.status).join(",");
}

export { parseAsientos, stringifyAsientos };
