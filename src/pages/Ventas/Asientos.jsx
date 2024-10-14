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
import Swal from "sweetalert2";
import asientospaService from "../../services/asientospa";
import asientospbService from "../../services/asientospb";
import "./asientos.css"; // Asegúrate de crear un archivo CSS para personalizar estilos
import imgAsiento from "../../assets/seat-icon.svg";
const inicialPlantaAlta = [];

const inicialPlantaBaja = [];

const Asientos = (props) => {
  const [plantaAlta, setPlantaAlta] = useState(inicialPlantaAlta);
  const [plantaBaja, setPlantaBaja] = useState(inicialPlantaBaja);
  const [asientosSelcionados, setAsientosSeleccionados] = useState([]);

  const getSeatColor = (estado) => {
    if (estado === "seleccionado") {
      return "warning";
    }
    if (estado === "libre") {
      return "success";
    }
    if (estado === "ocupado") {
      return "danger";
    }
  };

  const selecionarAsiento = (asiento) => {
    if (asiento.estado !== "ocupado" && asiento.estado !== "seleccionado") {
      Swal.fire({
        title: "Ingrese sus datos",
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="Nombre">' +
          '<input id="swal-input2" class="swal2-input" placeholder="CI">',
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        preConfirm: () => {
          const nombre = document.getElementById("swal-input1").value;
          const ci = document.getElementById("swal-input2").value;
          if (!nombre || !ci) {
            Swal.showValidationMessage("Por favor ingrese ambos datos");
            return false;
          }
          return { nombre, ci };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const { nombre, ci } = result.value;
          if (asiento.estado === "libre") {
            setAsientosSeleccionados([
              ...asientosSelcionados,
              { ...asiento, nombre, ci },
            ]);
            cambiarEstadoAsiento(
              asiento.numAsiento,
              "seleccionado",
              nombre,
              ci
            );
          }
        }
      });
    }
    if (asiento.estado === "seleccionado") {
      setAsientosSeleccionados(
        asientosSelcionados.filter(
          (asiento1) => asiento1.numAsiento !== asiento.numAsiento
        )
      );
      cambiarEstadoAsiento(asiento.numAsiento, "libre", "", "", false);
    }
  };

  const cambiarEstadoAsiento = (numAsiento, estado, nombre, ci, venta) => {
    plantaAlta.map((asiento) => {
      if (asiento.numAsiento === numAsiento) {
        asiento.estado = estado;
        if (nombre && ci) {
          asiento.nombre = nombre;
          asiento.ci = ci;
        }
        if (venta === true) {
          const asientoActualizado = { ...asiento, estado: estado, nombre, ci };
          asientospaService.update(
            asiento.idAsientoPa,
            props.item.idViaje,
            asientoActualizado
          );
        }
      }
    });
    plantaBaja.map((asiento) => {
      if (asiento.numAsiento === numAsiento) {
        asiento.estado = estado;
        if (nombre && ci) {
          asiento.nombre = nombre;
          asiento.ci = ci;
        }
        if (venta === true) {
          const asientoActualizado = { ...asiento, estado, nombre, ci };
          asientospbService.update(
            asiento.idAsientoPb,
            props.item.idViaje,
            asientoActualizado
          );
        }
      }
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
  const { onChangeAsientos } = props;

  useEffect(() => {
    onChangeAsientos(asientosSelcionados);
  }, [asientosSelcionados, onChangeAsientos]);
  useEffect(() => {
    if (props.boletoRealizado === true) {
      asientosSelcionados.map((asiento) => {
        cambiarEstadoAsiento(
          asiento.numAsiento,
          "ocupado",
          asiento.nombre,
          asiento.ci,
          true
        );
      });

      setAsientosSeleccionados([]);
    }
  }, [props.boletoRealizado]);
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
                    onClick={() => selecionarAsiento(asiento)}
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
                    onClick={() => selecionarAsiento(asiento)}
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
