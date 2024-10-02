/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Input, Container, Row, Col, Badge } from "reactstrap";
import { parseAsientos } from "../../utils/ParserAsientos";
import "./asientos.css"; // Asegúrate de crear un archivo CSS para personalizar estilos

const inicialPlantaAlta = [
  { id: 0, numAsiento: 0 },
  { id: 1, numAsiento: 0 },
  { id: 2, numAsiento: 0 },
  { id: 3, numAsiento: 0 },
  { id: 4, numAsiento: 0 },
  { id: 5, numAsiento: 0 },
  { id: 6, numAsiento: 0 },
  { id: 7, numAsiento: 0 },
  { id: 8, numAsiento: 0 },
  { id: 9, numAsiento: 0 },
  { id: 10, numAsiento: 0 },
  { id: 11, numAsiento: 0 },
  { id: 12, numAsiento: 0 },
  { id: 13, numAsiento: 0 },
  { id: 14, numAsiento: 0 },
  { id: 15, numAsiento: 0 },
  { id: 16, numAsiento: 0 },
  { id: 17, numAsiento: 0 },
  { id: 18, numAsiento: 0 },
  { id: 19, numAsiento: 0 },
  { id: 20, numAsiento: 0 },
  { id: 21, numAsiento: 0 },
  { id: 22, numAsiento: 0 },
  { id: 23, numAsiento: 0 },
  { id: 24, numAsiento: 0 },
  { id: 25, numAsiento: 0 },
  { id: 26, numAsiento: 0 },
  { id: 27, numAsiento: 0 },
  { id: 28, numAsiento: 0 },
  { id: 29, numAsiento: 0 },
  { id: 30, numAsiento: 0 },
  { id: 31, numAsiento: 0 },
  { id: 32, numAsiento: 0 },
  { id: 33, numAsiento: 0 },
  { id: 34, numAsiento: 0 },
  { id: 35, numAsiento: 0 },
  { id: 36, numAsiento: 0 },
  { id: 37, numAsiento: 0 },
  { id: 38, numAsiento: 0 },
  { id: 39, numAsiento: 0 },
  { id: 40, numAsiento: 0 },
  { id: 41, numAsiento: 0 },
  { id: 42, numAsiento: 0 },
  { id: 43, numAsiento: 0 },
  { id: 44, numAsiento: 0 },
  { id: 45, numAsiento: 0 },
];

const inicialPlantaBaja = [
  { id: 0, numAsiento: 0 },
  { id: 1, numAsiento: 0 },
  { id: 2, numAsiento: 0 },
  { id: 3, numAsiento: 0 },
  { id: 4, numAsiento: 0 },
  { id: 5, numAsiento: 0 },
  { id: 6, numAsiento: 0 },
  { id: 7, numAsiento: 0 },
  { id: 8, numAsiento: 0 },
  { id: 9, numAsiento: 0 },
  { id: 10, numAsiento: 0 },
  { id: 11, numAsiento: 0 },
  { id: 12, numAsiento: 0 },
  { id: 13, numAsiento: 0 },
  { id: 14, numAsiento: 0 },
  { id: 15, numAsiento: 0 },
  { id: 16, numAsiento: 0 },
];

const Asientos = (props) => {
  const [plantaAlta, setPlantaAlta] = useState(inicialPlantaAlta);
  const [plantaBaja, setPlantaBaja] = useState(inicialPlantaBaja);

  const getSeatColor = (numAsiento) => {
    if (numAsiento === 0) {
      return "danger";
    }
    if (numAsiento >= 1) {
      return "success";
    }
  };

  const onChangeAlta = (e, id) => {
    const updatedPlantaAlta = plantaAlta.map((asiento) =>
      asiento.id === id ? { ...asiento, numAsiento: e.target.value } : asiento
    );
    setPlantaAlta(updatedPlantaAlta);
    props.convertAsientos(updatedPlantaAlta, plantaBaja);
  };

  const onChangeBaja = (e, id) => {
    const updatedPlantaBaja = plantaBaja.map((asiento) =>
      asiento.id === id ? { ...asiento, numAsiento: e.target.value } : asiento
    );
    setPlantaBaja(updatedPlantaBaja);
    props.convertAsientos(plantaAlta, updatedPlantaBaja);
  };

  useEffect(() => {
    if (props.item) {
      setPlantaAlta(parseAsientos(props.item.plantaAlta));
      setPlantaBaja(parseAsientos(props.item.plantaBaja));
    }
  }, []);

  return (
    <Container>
      <h3>Planta Alta</h3>
      <div className="asientos-container">
        {plantaAlta.map((asiento, index) => (
          <div
            key={asiento.id}
            className={`text-center mb-3 ${index % 4 === 2 ? "pasillo" : ""}`}
          >
            {index % 4 !== 2 && (
              <Badge
                color={getSeatColor(asiento.numAsiento)}
                className="asiento-badge"
              >
                <Input
                  type="text"
                  value={asiento.numAsiento}
                  className="form-control asiento"
                  onChange={(e) => onChangeAlta(e, asiento.id)}
                />
              </Badge>
            )}
          </div>
        ))}
      </div>

      <h3>Planta Baja</h3>
      <div className="asientos-container">
        {plantaBaja.map((asiento, index) => (
          <div
            key={asiento.id}
            className={`text-center mb-3 ${index % 4 === 2 ? "pasillo" : ""}`}
          >
            {index % 4 !== 2 && (
              <Badge
                color={getSeatColor(asiento.numAsiento)}
                className="asiento-badge"
              >
                <Input
                  type="text"
                  value={asiento.numAsiento}
                  className="form-control asiento"
                  onChange={(e) => onChangeBaja(e, asiento.id)}
                />
              </Badge>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Asientos;
