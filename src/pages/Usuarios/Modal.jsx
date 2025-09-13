/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import AddEditForm from "./Formulario";

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
  const isEdit = props.item != null;
  const buttonProps = props.buttonProps || {};

  // Determinar propiedades del botón por defecto
  const defaultButtonProps = {
    color: isEdit ? "primary" : "success",
    onClick: toggle,
    ...buttonProps
  };

  // Si no se especifican estilos customizados, usar los por defecto
  if (!buttonProps.className && !defaultButtonProps.className) {
    defaultButtonProps.style = { 
      float: "left", 
      marginRight: "10px", 
      ...buttonProps.style 
    };
  }

  const button = (
    <Button {...defaultButtonProps}>
      {label}
    </Button>
  );

  const title = isEdit ? "Editar Usuario" : "Agregar Nuevo Usuario";

  return (
    <div>
      {button}
      <Modal
        isOpen={modal}
        toggle={toggle}
        className={props.className}
        backdrop={"static"}
        keyboard={false}
        size="lg"
      >
        <ModalHeader toggle={toggle} close={closeBtn}>
          <i className={`fas ${isEdit ? 'fa-edit' : 'fa-plus'} mr-2`}></i>
          {title}
        </ModalHeader>
        <ModalBody>
          <AddEditForm
            addItemToState={props.addItemToState}
            updateState={props.updateState}
            toggle={toggle}
            item={props.item}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ModalForm;
