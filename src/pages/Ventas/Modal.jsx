/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import AddPasajeroForm from "./FormAsiento";

function ModalForm(props) {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const closeBtn = (
    <button className="close" onClick={toggle}>
      &times;
    </button>
  );
  const label = props.buttonLabel;

  let button = "";
  let title = "";

  if (props.selectAsientos && props.selectAsientos.length > 0) {
    button = button = (
      <Button
        color="success"
        onClick={toggle}
        style={{
          float: "left",
          marginRight: "10px",
          marginTop: "100px",
          fontSize: "1.6em",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {label}
      </Button>
    );
    title = "Venta de Pasajes";
  }
  return (
    <div>
      {button}
      <Modal
        isOpen={modal}
        toggle={toggle}
        className={props.className}
        backdrop={"static"}
        keyboard={false}
      >
        <ModalHeader toggle={toggle} close={closeBtn}>
          {title}
        </ModalHeader>
        <ModalBody>
          <AddPasajeroForm
            addItemToState={props.addItemToState}
            updateState={props.updateState}
            selectAsientos={props.selectAsientos}
            onChangeBoletoRealizado={props.onChangeBoletoRealizado}
            toggle={toggle}
            item={props.item}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ModalForm;
