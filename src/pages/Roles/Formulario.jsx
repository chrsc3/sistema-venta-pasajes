/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import rolService from "../../services/roles";
import permisosService from "../../services/permisos";

function AddEditForm(props) {
  const [form, setValues] = useState({
    idRol: 0,
    nombre: "",
    roles_has_permisos: [],
  });
  const [permisos, setPermisos] = useState([]);
  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitFormAdd = (e) => {
    console.log(props.item);
    e.preventDefault();
    rolService
      .create(form)
      .then((response) => {
        console.log(response);
        const item = { ...response, roles_has_permisos: [] };
        props.addItemToState(item);
        props.toggle();
      })
      .catch((error) => {
        alert("Error al agregar rol", error);
      });
    props.toggle();
  };

  const submitFormEdit = (e) => {
    e.preventDefault();
    rolService
      .update(form.idRol, form)
      .then((response) => {
        console.log(response);
        const item = { ...response, roles_has_permisos: [] };
        props.updateState(item);
        props.toggle();
      })
      .catch((error) => {
        console.log(error);
        alert("Error al actualizar rol", error);
      });
    props.toggle();
  };

  useEffect(() => {
    if (props.item) {
      const { idRol, nombre, roles_has_permisos } = props.item;
      setValues({
        idRol,
        nombre,
        roles_has_permisos: roles_has_permisos.map(
          (permiso) => permiso.Permisos_idPermiso
        ),
      });
    }
  }, [props.item]);
  useEffect(() => {
    permisosService.getAll().then((response) => {
      setPermisos(response);
    });
  }, []);

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
        {props.item &&
          permisos.map((permiso) => {
            return (
              <FormGroup check key={permiso.idPermiso}>
                <Label check>
                  <Input
                    type="checkbox"
                    name="roles"
                    value={permiso.idPermiso}
                    checked={form.roles_has_permisos.includes(
                      permiso.idPermiso
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setValues({
                          ...form,
                          roles_has_permisos: [
                            ...form.roles_has_permisos.concat(
                              permiso.idPermiso
                            ),
                          ],
                        });
                      } else {
                        setValues({
                          ...form,
                          roles_has_permisos: form.roles_has_permisos.filter(
                            (rol) => rol !== permiso.idPermiso
                          ),
                        });
                      }
                    }}
                  />
                  {permiso.nombre}
                </Label>
              </FormGroup>
            );
          })}
      </FormGroup>
      <Button>Guardar</Button>
    </Form>
  );
}

export default AddEditForm;
