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
    if (estado === "reservado") {
      return "info";
    }
  };

  const selecionarAsiento = (asiento) => {
    // Mostrar información si el asiento está ocupado o reservado
    if (asiento.estado === "ocupado" || asiento.estado === "reservado") {
      Swal.fire({
        title:
          asiento.estado === "ocupado"
            ? "Asiento Ocupado"
            : "Asiento Reservado",
        html: `
          <p><strong>Nombre:</strong> ${asiento.nombre || "N/A"}</p>
          <p><strong>CI:</strong> ${asiento.ci || "N/A"}</p>
        `,
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    if (asiento.estado !== "seleccionado") {
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
  }, [props.item, props.recargarAsientos]);
  const { onChangeAsientos } = props;

  useEffect(() => {
    onChangeAsientos(asientosSelcionados);
  }, [asientosSelcionados, onChangeAsientos]);

  useEffect(() => {
    if (props.boletoRealizado === true) {
      // Limpiar selección después de crear boleto
      setAsientosSeleccionados([]);
      // Los asientos se recargan automáticamente por el useEffect que escucha recargarAsientos
    }
  }, [props.boletoRealizado]);
  return (
    <Container>
      <Row style={{ marginBottom: "20px" }}>
        <Col>
          <h4>Leyenda:</h4>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#28a745",
                  borderRadius: "3px",
                }}
              ></div>
              <span>Libre</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#ffc107",
                  borderRadius: "3px",
                }}
              ></div>
              <span>Seleccionado</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#17a2b8",
                  borderRadius: "3px",
                }}
              ></div>
              <span>Reservado</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#dc3545",
                  borderRadius: "3px",
                }}
              ></div>
              <span>Ocupado</span>
            </div>
          </div>
        </Col>
      </Row>
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
                  <div style={{ position: "relative" }}>
                    <Card
                      color={getSeatColor(asiento.estado)}
                      className="asiento-card"
                      onClick={() => selecionarAsiento(asiento)}
                      style={{ cursor: "pointer" }}
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
                            fontWeight: "bold",
                          }}
                        >
                          {asiento.numAsiento}
                        </CardText>
                      </CardImgOverlay>
                    </Card>
                    {(asiento.estado === "ocupado" ||
                      asiento.estado === "reservado") &&
                      asiento.nombre &&
                      asiento.nombre.trim() !== "" && (
                        <div
                          style={{
                            position: "absolute",
                            top: "-20px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background:
                              asiento.estado === "ocupado"
                                ? "#dc3545"
                                : "#17a2b8",
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            whiteSpace: "nowrap",
                            fontWeight: "bold",
                            zIndex: 10,
                          }}
                        >
                          {asiento.nombre}
                        </div>
                      )}
                  </div>
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
                  <div style={{ position: "relative" }}>
                    <Card
                      color={getSeatColor(asiento.estado)}
                      className="asiento-card"
                      onClick={() => selecionarAsiento(asiento)}
                      style={{ cursor: "pointer" }}
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
                        <CardText
                          style={{ color: "white", fontWeight: "bold" }}
                        >
                          {asiento.numAsiento}
                        </CardText>
                      </CardImgOverlay>
                    </Card>
                    {(asiento.estado === "ocupado" ||
                      asiento.estado === "reservado") &&
                      asiento.nombre &&
                      asiento.nombre.trim() !== "" && (
                        <div
                          style={{
                            position: "absolute",
                            top: "-20px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background:
                              asiento.estado === "ocupado"
                                ? "#dc3545"
                                : "#17a2b8",
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            whiteSpace: "nowrap",
                            fontWeight: "bold",
                            zIndex: 10,
                          }}
                        >
                          {asiento.nombre}
                        </div>
                      )}
                  </div>
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
