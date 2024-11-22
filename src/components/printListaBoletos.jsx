/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
} from "reactstrap";
import ticket from "../utils/ticketListaPasajeros.js";

const PrintPDF = ({ detalleBoletos }) => {
  const [base64, setBase64] = useState("");
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const onGenerateTicket = async (output) => {
    setBase64("");
    setMessage("");

    const response = await ticket(output, detalleBoletos);

    if (!response?.success) {
      alert(response?.message);
      return;
    }

    if (output === "b64") {
      setBase64(response?.content ?? "");
      console.log(detalleBoletos);
    }

    setMessage(response?.message);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <Container>
      <div style={{ display: "flex", gap: "10px" }}>
        <Button color="primary" onClick={() => onGenerateTicket("b64")}>
          GENERAR LISTA
        </Button>
        <Button color="secondary" onClick={() => onGenerateTicket("print")}>
          IMPRIMIR LISTA
        </Button>
      </div>

      {message && <p className="mx-alert-info">{message}</p>}

      {base64 && (
        <>
          <Button color="info" onClick={toggleModal}>
            Previsualizar PDF lista de boletos
          </Button>

          <Modal isOpen={modal} toggle={toggleModal} size="lg">
            <ModalHeader toggle={toggleModal}>
              Previsualización dela Lista
            </ModalHeader>
            <ModalBody>
              <iframe
                src={`data:application/pdf;base64,${base64}`}
                className="mx-iframe"
                title="Ticket PDF"
                style={{ width: "100%", height: "500px" }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleModal}>
                Cerrar
              </Button>
              <Button color="primary" onClick={() => onGenerateTicket("print")}>
                Imprimir
              </Button>
            </ModalFooter>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default PrintPDF;
