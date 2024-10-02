/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardText,
  CardImg,
  CardImgOverlay,
  Row,
  Col,
} from "reactstrap";

import { parseAsientos } from "../../utils/ParserAsientos";
import busService from "../../services/buses";
import "./asientos.css"; // Asegúrate de crear un archivo CSS para personalizar estilos
import imgAsiento from "../../assets/seat-icon.svg";
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
  const [bus, setBus] = useState([]);

  const getSeatColor = (numAsiento) => {
    if (numAsiento === 0) {
      return "danger";
    }
    if (numAsiento >= 1) {
      return "success";
    }
  };

  useEffect(() => {
    if (props.item) {
      busService
        .getOne(props.item.Buses_idBus)
        .then((bus1) => {
          if (bus1) {
            setBus(bus1);
            setPlantaAlta(parseAsientos(bus1.plantaAlta));
            setPlantaBaja(parseAsientos(bus1.plantaBaja));
          }
        })
        .catch((error) => {
          console.error("Error fetching bus data:", error);
        });
    }
  }, [props.item]);

  return (
    <Container>
      <Row>
        <Col>
          <h3>Planta Alta</h3>
          <div className="asientos-container">
            {plantaAlta.map((asiento, index) => (
              <div
                key={asiento.id}
                className={`text-center mb-0 ${
                  index % 4 === 2 || asiento.numAsiento == 0
                    ? "pasillo"
                    : "asiento"
                }`}
              >
                {index % 4 !== 2 && asiento.numAsiento != 0 && (
                  <Card
                    color={getSeatColor(asiento.numAsiento)}
                    className="asiento-card"
                  >
                    <CardImg
                      style={{
                        height: "100%",
                        objectFit: "contain",
                      }}
                      src={imgAsiento}
                      alt="Seat icon"
                    />
                    <CardImgOverlay>
                      <CardText
                        style={{
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        {asiento.numAsiento}
                      </CardText>
                    </CardImgOverlay>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </Col>
        <Col>
          <h3>Planta Baja</h3>
          <div className="asientos-container">
            {plantaBaja.map((asiento, index) => (
              <div
                key={asiento.id}
                className={`text-center mb-2 ${
                  index % 4 === 2 ? "pasillo" : "asiento"
                }`}
              >
                {index % 4 !== 2 && (
                  <Card
                    color={getSeatColor(asiento.numAsiento)}
                    className="asiento-card"
                  >
                    <CardImg
                      width="100%"
                      style={{
                        height: "100%",
                        objectFit: "contain",
                      }}
                      src={imgAsiento}
                      alt="Seat icon"
                    />
                    <CardImgOverlay>
                      <CardText style={{ color: "white" }}>
                        {asiento.id}
                      </CardText>
                    </CardImgOverlay>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Asientos;
