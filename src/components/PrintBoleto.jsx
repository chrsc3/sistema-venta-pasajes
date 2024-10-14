/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ticket from "../utils/ticketBoleto.js";

const PrintPDF = ({ boleto }) => {
  const [base64, setBase64] = useState("");
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const onGenerateTicket = async (output) => {
    setBase64("");
    setMessage("");

    const response = await ticket(output, boleto);

    if (!response?.success) {
      alert(response?.message);
      return;
    }

    if (output === "b64") {
      setBase64(response?.content ?? "");
    }

    setMessage(response?.message);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <div className="mx-main-container">
      <div className="mx-btn-container">
        <Button color="primary" onClick={() => onGenerateTicket("b64")}>
          GENERAR TICKET
        </Button>
        <Button color="secondary" onClick={() => onGenerateTicket("print")}>
          IMPRIMIR TICKET
        </Button>
      </div>

      {message && <p className="mx-alert-info">{message}</p>}

      {base64 && (
        <>
          <Button color="info" onClick={toggleModal}>
            Previsualizar PDF
          </Button>

          <Modal isOpen={modal} toggle={toggleModal} size="lg">
            <ModalHeader toggle={toggleModal}>
              Previsualización del Ticket
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
    </div>
  );
};

export default PrintPDF;
