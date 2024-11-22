/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import busService from "../../services/buses";
import Asientos from "./Asientos";

function AddEditForm(props) {
  const [form, setValues] = useState({
    idBus: 0,
    marca: "",
    placa: "",
    tipo: "",
    estado: "",
    plantaAlta: "",
    plantaBaja: "",
  });
  const [imagen, setImagen] = useState(null);
  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const convertAsientos = (plantaAlta, plantaBaja) => {
    setValues({
      ...form,
      plantaAlta: plantaAlta,
      plantaBaja: plantaBaja,
    });
  };

  const submitFormAdd = (e) => {
    e.preventDefault();
    busService
      .create({ ...form, imagen })
      .then((response) => {
        props.addItemToState(response);
        props.toggle();
      })
      .catch((error) => {
        alert("Error al agregar bus", error);
      });
  };

  const submitFormEdit = (e) => {
    e.preventDefault();
    busService
      .update(form.idBus, form)
      .then((response) => {
        props.updateState(response);
        props.toggle();
      })
      .catch((error) => {
        alert("Error al actualizar bus", error);
      });
  };

  useEffect(() => {
    if (props.item) {
      const { idBus, marca, placa, tipo, estado, plantaAlta, plantaBaja } =
        props.item;
      setValues({ idBus, marca, placa, tipo, estado, plantaAlta, plantaBaja });
    }
  }, [props.item]);

  return (
    <div>
      <Form onSubmit={props.item ? submitFormEdit : submitFormAdd}>
        <FormGroup>
          <Label for="marca">Marca</Label>
          <Input
            type="text"
            name="marca"
            id="marca"
            onChange={onChange}
            value={form.marca === null ? "" : form.marca}
          />
        </FormGroup>
        <FormGroup>
          <Label for="placa">Placa</Label>
          <Input
            type="text"
            name="placa"
            id="placa"
            onChange={onChange}
            value={form.placa === null ? "" : form.placa}
          />
        </FormGroup>
        <FormGroup>
          <Label for="tipo">Tipo</Label>
          <Input
            type="text"
            name="tipo"
            id="tipo"
            onChange={onChange}
            value={form.tipo === null ? "" : form.tipo}
          />
        </FormGroup>
        <FormGroup>
          <Label for="imagen">Imagen</Label>
          <Input
            type="file"
            name="imagen"
            id="imagen"
            onChange={(e) => {
              const file = e.target.files[0];
              setImagen(file);
            }}
          />
        </FormGroup>
        {imagen && (
          <FormGroup>
            <Label for="preview">Vista previa de la imagen</Label>
            <div>
              <img
                src={URL.createObjectURL(imagen)}
                alt="Vista previa"
                style={{
                  width: "90%",
                  height: "auto",
                  display: "flex",
                  margin: "auto",
                  marginBottom: "10px",
                }}
              />
            </div>
          </FormGroup>
        )}

        <Button>Guardar</Button>
      </Form>
      <Asientos convertAsientos={convertAsientos} item={props.item} />
    </div>
  );
}

export default AddEditForm;
