/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { UserContext } from "../../context/userContext";
import boletoService from "../../services/boletos";
import asientospaService from "../../services/asientospa";
import asientospbService from "../../services/asientospb";
import ticket from "../../utils/ticketBoleto";
function AddPasajeroForm(props) {
  const Usercontext = useContext(UserContext);
  const [precioPasaje, setPrecioPasaje] = useState(0);
  const [detalleBoleto, setDetalleBoleto] = useState([
    {
      numAsiento: "",
      nombre: "",
      ci: "",
      precioPasaje: 0,
      Viajes_idViaje: "",
    },
  ]);
  const [form, setValues] = useState({
    nombre: "",
    ci: "",
    total: 0,
    Usuarios_idUsuario: Usercontext.user.idUsuario,
  });

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const onChangePrecio = (e) => {
    setPrecioPasaje(e.target.value);
  };

  const submitFormAdd = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      total: detalleBoleto.length * precioPasaje,
      detalleBoleto: detalleBoleto.map((detalle) => ({
        ...detalle,
        precio: precioPasaje,
      })),
    };
    boletoService
      .create(data)
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Boleto creado",
          text: "El boleto ha sido creado exitosamente",
        });
        props.toggle();
        props.onChangeBoletoRealizado();
        ticket("print", response);
      })
      .catch((error) => {
        console.error("Error adding boleto:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al crear el boleto: Datos inválidos",
        });
      });
  };

  const submitFormEdit = (e) => {};

  useEffect(() => {
    if (props.item) {
      const { nombre, ci, precioPasaje } = props.item;
      setValues({ nombre, ci, precioPasaje });
    }
    if (props.selectAsientos) {
      const asientosSelcionados = props.selectAsientos.map((asiento) => ({
        numAsiento: asiento.numAsiento,
        nombre: asiento.nombre,
        ci: asiento.ci,
        Viajes_idViaje: asiento.Viajes_idViaje,
      }));
      console.log(props.selectAsientos);
      setDetalleBoleto(asientosSelcionados);
    }
  }, [props.item, props.selectAsientos]);

  return (
    <Form onSubmit={props.item ? submitFormEdit : submitFormAdd}>
      <FormGroup>
        <Label for="nombre">Nombre para el Boleto</Label>
        <Input
          type="text"
          name="nombre"
          id="nombre"
          onChange={onChange}
          value={form.nombre === null ? "" : form.nombre}
        />
      </FormGroup>
      <FormGroup>
        <Label for="ci">NIT/CI</Label>
        <Input
          type="text"
          name="ci"
          id="ci"
          onChange={onChange}
          value={form.ci === null ? "" : form.ci}
        />
      </FormGroup>
      <FormGroup>
        <Label for="precioPasaje">Precio del Pasaje</Label>
        <Input
          type="text"
          name="precioPasaje"
          id="precioPasaje"
          onChange={onChangePrecio}
          value={precioPasaje === null ? "" : precioPasaje}
        />
      </FormGroup>
      <FormGroup>
        <Label>Asientos:</Label>
        <div>
          <Label>
            {detalleBoleto.map((detalle) => detalle.numAsiento).join(", ")}
          </Label>
        </div>
      </FormGroup>
      <FormGroup>
        <Label>Total:</Label>
        <div>
          <Label>{detalleBoleto.length * precioPasaje}</Label>
        </div>
      </FormGroup>
      <Button>Vender</Button>
    </Form>
  );
}

export default AddPasajeroForm;
