/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import userService from "../../services/user";
import rolesService from "../../services/roles";

function AddEditForm(props) {
  const [form, setValues] = useState({
    idUsuario: 0,
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    user: "",
    password: "",
    Roles_idRol: 0,
  });
  const [roles, setRoles] = useState([]);

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitFormAdd = (e) => {
    console.log(props.item);
    e.preventDefault();
    userService
      .create(form)
      .then((response) => {
        props.addItemToState(response);
        props.toggle();
      })
      .catch((error) => {
        alert("Error al agregar usuario", error);
      });
  };

  const submitFormEdit = (e) => {
    e.preventDefault();
    userService
      .update(form.idUsuario, form)
      .then((response) => {
        console.log(response);
        props.updateState(response);
        props.toggle();
      })
      .catch((error) => {
        alert("Error al actualizar usuario", error);
      });
  };

  useEffect(() => {
    if (props.item) {
      const {
        idUsuario,
        nombre,
        apellido,
        telefono,
        direccion,
        user,
        password,
        Roles_idRol,
      } = props.item;
      setValues({
        idUsuario,
        nombre,
        apellido,
        telefono,
        direccion,
        user,
        password,
        Roles_idRol,
      });
    }
  }, [props.item]);

  useEffect(() => {
    rolesService
      .getAll()
      .then((response) => {
        setRoles(response);
      })
      .catch((error) => {
        console.log(error);
        alert("Error al obtener roles");
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
      </FormGroup>
      <FormGroup>
        <Label for="apellido">Apellido</Label>
        <Input
          type="text"
          name="apellido"
          id="apellido"
          onChange={onChange}
          value={form.apellido === null ? "" : form.apellido}
        />
      </FormGroup>
      <FormGroup>
        <Label for="direccion">Direccion</Label>
        <Input
          type="text"
          name="direccion"
          id="direccion"
          onChange={onChange}
          value={form.direccion === null ? "" : form.direccion}
        />
      </FormGroup>
      <FormGroup>
        <Label for="telefono">Telefono</Label>
        <Input
          type="text"
          name="telefono"
          id="telefono"
          onChange={onChange}
          value={form.telefono === null ? "" : form.telefono}
          placeholder="ex. 78451132"
        />
      </FormGroup>
      <FormGroup>
        <Label for="user">Usuario</Label>
        <Input
          type="text"
          name="user"
          id="user"
          onChange={onChange}
          value={form.user === null ? "" : form.user}
        />
      </FormGroup>
      {props.item ? null : (
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            onChange={onChange}
            value={form.password === null ? "" : form.password}
          />
        </FormGroup>
      )}

      <FormGroup>
        <Label for="Roles_idRol">Rol</Label>
        <Input
          type="select"
          name="Roles_idRol"
          id="Roles_idRol"
          onChange={onChange}
          value={form.Roles_idRol}
        >
          <option value="0">Seleccione un rol</option>
          {roles.map((rol) => {
            return (
              <option key={rol.idRol} value={rol.idRol}>
                {rol.nombre}
              </option>
            );
          })}
        </Input>
      </FormGroup>
      <Button>Guardar</Button>
    </Form>
  );
}

export default AddEditForm;
