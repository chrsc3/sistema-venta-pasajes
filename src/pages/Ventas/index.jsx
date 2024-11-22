/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Container, Row, Col, List } from "reactstrap";
import Asientos from "./Asientos";
import viajesService from "../../services/viajes";
import { useMatch } from "react-router-dom";
import ModalForm from "./Modal";
import ListaBoletos from "./ListaBoletos";

function Ventas(props) {
  const match = useMatch("/ventas/:id");
  const [viaje, setViaje] = useState(null);
  const [boletoRealizado, setBoletoRealizado] = useState(false);
  const [selectAsientos, setSelectAsientos] = useState([]);

  const onChangeAsientos = (selectAsientos) => {
    setSelectAsientos(selectAsientos);
  };
  const onChangeBoletoRealizado = () => {
    setBoletoRealizado(!boletoRealizado);
  };

  useEffect(() => {
    if (match) {
      viajesService.getOne(Number(match.params.id)).then((viaje) => {
        setViaje(viaje);
      });
    }
  }, [match]);

  return (
    <Container>
      <Row>
        <Col>
          <h1 style={{ margin: "20px 0" }}>Venta de boletos</h1>
        </Col>
      </Row>
      {viaje && (
        <Row>
          <Col>
            <h2>Información del viaje</h2>
            <p>
              <strong>Origen:</strong> {viaje.origen}
            </p>
            <p>
              <strong>Destino:</strong> {viaje.destino}
            </p>
            <p>
              <strong>Fecha:</strong> {viaje.fechaViaje.fecha}
            </p>
            <p>
              <strong>Hora:</strong> {viaje.fechaViaje.hora}
            </p>
          </Col>
          <Col>
            <img
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgqIKjzM6a3HFhVpYSXiz6ucRSUXw1rbLAXguiAP7NkWxvTpgMq7CiBDIdYuaqt5ainxv8eqhG5DmXQm5lPWiXpp5ED2wYGnPH5Esnk0MWTDYu0HZw8ihI0qxaQYCsqbxBKLhyphenhyphen0pbrMRbmm/s1600/marcopolo_paradiso1800dd_solimoes.jpg"
              alt="Imagen del viaje"
              style={{ width: "500px", height: "auto" }}
            />
            <ModalForm
              buttonLabel="Vender"
              selectAsientos={selectAsientos}
              onChangeBoletoRealizado={onChangeBoletoRealizado}
            />
          </Col>
        </Row>
      )}
      <Row>
        <Asientos
          item={viaje}
          onChangeAsientos={onChangeAsientos}
          boletoRealizado={boletoRealizado}
        />
      </Row>
      <Row>
        <ListaBoletos viaje={viaje} boletoRealizado={boletoRealizado} />
      </Row>
    </Container>
  );
}

export default Ventas;
