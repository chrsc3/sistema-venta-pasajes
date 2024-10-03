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
import asientospaService from "../../services/asientospa";
import asientospbService from "../../services/asientospb";
import "./asientos.css"; // Asegúrate de crear un archivo CSS para personalizar estilos
import imgAsiento from "../../assets/seat-icon.svg";
const inicialPlantaAlta = [];

const inicialPlantaBaja = [];

const Asientos = (props) => {
  const [plantaAlta, setPlantaAlta] = useState(inicialPlantaAlta);
  const [plantaBaja, setPlantaBaja] = useState(inicialPlantaBaja);

  const getSeatColor = (numAsiento) => {
    if (numAsiento === "reservado") {
      return "danger";
    }
    if (numAsiento === "libre") {
      return "success";
    }
  };

  const reservaAsientoPa = (idAsiento, idViaje, numAsiento, estado) => {
    estado == "reservado" ? (estado = "libre") : (estado = "reservado");
    asientospaService
      .update(idAsiento, idViaje, {
        numAsiento: numAsiento,
        estado: estado,
        nombre: "",
        ci: "",
      })
      .then((response) => {
        setPlantaAlta(
          plantaAlta.map((asiento) =>
            asiento.idAsientoPa === idAsiento
              ? {
                  ...asiento,
                  estado: response.estado,
                }
              : asiento
          )
        );
      })
      .catch((error) => {
        console.error("Error updating asientospa data:", error);
      });
  };
  const reservaAsientoPb = (idAsiento, idViaje, numAsiento, estado) => {
    estado == "reservado" ? (estado = "libre") : (estado = "reservado");
    asientospbService
      .update(idAsiento, idViaje, {
        numAsiento: numAsiento,
        estado: estado,
        nombre: "",
        ci: "",
      })
      .then((response) => {
        setPlantaBaja(
          plantaBaja.map((asiento) =>
            asiento.idAsientoPb === idAsiento
              ? {
                  ...asiento,
                  estado: response.estado,
                }
              : asiento
          )
        );
      })
      .catch((error) => {
        console.error("Error updating asientospb data:", error);
      });
  };

  useEffect(() => {
    if (props.item) {
      asientospaService
        .getbyviajes(props.item.idViaje)
        .then((asientos) => {
          setPlantaAlta(asientos);
        })
        .catch((error) => {
          console.error("Error fetching asientospa data:", error);
        });
      asientospbService
        .getbyviajes(props.item.idViaje)
        .then((asientos) => {
          setPlantaBaja(asientos);
        })
        .catch((error) => {
          console.error("Error fetching asientospb data:", error);
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
                key={asiento.idAsientoPa}
                className={`text-center mb-0 ${
                  index % 4 === 2 || asiento.numAsiento == 0
                    ? "pasillo"
                    : "asiento"
                }`}
              >
                {index % 4 !== 2 && asiento.numAsiento != 0 && (
                  <Card
                    color={getSeatColor(asiento.estado)}
                    className="asiento-card"
                    onClick={() =>
                      reservaAsientoPa(
                        asiento.idAsientoPa,
                        props.item.idViaje,
                        asiento.numAsiento,
                        asiento.estado
                      )
                    }
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
                key={asiento.idAsientoPb}
                className={`text-center mb-0 ${
                  index % 4 === 2 || asiento.numAsiento == 0
                    ? "pasillo"
                    : "asiento"
                }`}
              >
                {index % 4 !== 2 && asiento.numAsiento != 0 && (
                  <Card
                    color={getSeatColor(asiento.estado)}
                    className="asiento-card"
                    onClick={() =>
                      reservaAsientoPb(
                        asiento.idAsientoPb,
                        props.item.idViaje,
                        asiento.numAsiento,
                        asiento.estado
                      )
                    }
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
                        {asiento.numAsiento}
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
