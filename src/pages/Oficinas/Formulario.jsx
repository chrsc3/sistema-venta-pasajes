/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import oficinaService from "../../services/oficinas";

function AddEditForm(props) {
  const [form, setValues] = useState({
    idOficina: 0,
    nombre: "",
    ciudad: "",
    direccion: "",
    telefono: "",
    estado: "",
  });

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitFormAdd = (e) => {
    e.preventDefault();
    oficinaService
      .create(form)
      .then((response) => {
        props.addItemToState(response);
        props.toggle();
      })
      .catch((error) => {
        alert("Error al agregar oficina", error);
      });
  };

  const submitFormEdit = (e) => {
    e.preventDefault();
    oficinaService
      .update(form.idOficina, form)
      .then((response) => {
        props.updateState(response);
        props.toggle();
      })
      .catch((error) => {
        alert("Error al actualizar oficina", error);
      });
  };

  useEffect(() => {
    if (props.item) {
      const { idOficina, nombre, ciudad, direccion, telefono, estado } =
        props.item;
      setValues({
        idOficina,
        nombre,
        ciudad,
        direccion,
        telefono,
        estado,
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
        <Label for="ciudad">Ciudad</Label>
        <Input
          type="text"
          name="ciudad"
          id="ciudad"
          onChange={onChange}
          value={form.ciudad === null ? "" : form.ciudad}
        />
      </FormGroup>
      <FormGroup>
        <Label for="direccion">Dirección</Label>
        <Input
          type="text"
          name="direccion"
          id="direccion"
          onChange={onChange}
          value={form.direccion === null ? "" : form.direccion}
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
