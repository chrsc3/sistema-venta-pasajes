/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import choferService from "../../services/choferes";

function AddEditForm(props) {
  const [form, setValues] = useState({
    idChofer: 0,
    nombre: "",
    numLicencia: "",
  });

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitFormAdd = (e) => {
    e.preventDefault();
    choferService
      .create(form)
      .then((response) => {
        props.addItemToState(response);
        props.toggle();
      })
      .catch((error) => {
        alert("Error al agregar chofer", error);
      });
  };

  const submitFormEdit = (e) => {
    e.preventDefault();
    choferService
      .update(form.idChofer, form)
      .then((response) => {
        props.updateState(response);
        props.toggle();
      })
      .catch((error) => {
        alert("Error al actualizar chofer", error);
      });
  };

  useEffect(() => {
    if (props.item) {
      const { idChofer, nombre, numLicencia, telefono } = props.item;
      setValues({
        idChofer,
        nombre,
        numLicencia,
        telefono,
      });
    }
  }, [props.item]);

  return (
    <Form onSubmit={props.item ? submitFormEdit : submitFormAdd}>
      <FormGroup>
        <Label for="nombre">Nombre</Label>
        <Input
          type="text"
          name="nombre"
          id="nombre"
          onChange={onChange}
          value={form.nombre === null ? "" : form.nombre}
        />
      </FormGroup>
      <FormGroup>
        <Label for="numLicencia">Número de Licencia</Label>
        <Input
          type="text"
          name="numLicencia"
          id="numLicencia"
          onChange={onChange}
          value={form.numLicencia === null ? "" : form.numLicencia}
        />
      </FormGroup>
      <FormGroup>
        <Label for="telefono">Teléfono</Label>
        <Input
          type="text"
          name="telefono"
          id="telefono"
          onChange={onChange}
          value={form.telefono === null ? "" : form.telefono}
        />
      </FormGroup>
      <Button>Guardar</Button>
    </Form>
  );
}

export default AddEditForm;
