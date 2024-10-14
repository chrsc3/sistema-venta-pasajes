/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import viajesService from "../../services/viajes";
import busesService from "../../services/buses";
import oficinasService from "../../services/oficinas";
import choferService from "../../services/choferes";
import { revertirFecha } from "../../utils/parserFecha";

function AddEditForm(props) {
  const [form, setValues] = useState({
    idViaje: 0,
    origen: "",
    destino: "",
    fechaViajeFecha: "",
    fechaViajeHora: "",
    estado: "",
    Buses_idBus: 0,
    Oficinas_idOficina: 0,
    idChofer1: 0,
    idChofer2: 0,
  });
  const [buses, setBuses] = useState([]);
  const [oficinas, setOficinas] = useState([]);
  const [choferes, setChoferes] = useState([]);

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitFormAdd = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      fechaViaje: revertirFecha({
        fecha: form.fechaViajeFecha,
        hora: form.fechaViajeHora,
      }),
    };
    viajesService
      .create(data)
      .then((response) => {
        props.addItemToState(response);
        props.toggle();
      })
      .catch((error) => {
        alert("Error al agregar viaje", error);
      });
  };

  const submitFormEdit = (e) => {
    e.preventDefault();
    viajesService
      .update(form.idViaje, form)
      .then((response) => {
        props.updateState(response);
        props.toggle();
      })
      .catch((error) => {
        alert("Error al actualizar viaje", error);
      });
  };

  useEffect(() => {
    if (props.item) {
      const {
        idViaje,
        origen,
        destino,
        fechaViaje,
        estado,
        Buses_idBus,
        Oficinas_idOficina,
      } = props.item;
      setValues({
        idViaje,
        origen,
        destino,
        fechaViajeFecha: fechaViaje.fecha,
        fechaViajeHora: fechaViaje.hora,
        estado,
        Buses_idBus,
        Oficinas_idOficina,
      });
    }
  }, [props.item]);

  useEffect(() => {
    busesService
      .getAll()
      .then((response) => {
        setBuses(response);
      })
      .catch((error) => {
        alert("Error al obtener buses", error);
      });

    oficinasService
      .getAll()
      .then((response) => {
        setOficinas(response);
      })
      .catch((error) => {
        alert("Error al obtener oficinas", error);
      });
    choferService
      .getAll()
      .then((response) => {
        setChoferes(response);
      })
      .catch((error) => {
        alert("Error al obtener choferes", error);
      });
  }, []);

  return (
    <Form onSubmit={props.item ? submitFormEdit : submitFormAdd}>
      <FormGroup>
        <Label for="origen">Origen</Label>
        <Input
          type="text"
          name="origen"
          id="origen"
          onChange={onChange}
          value={form.origen === null ? "" : form.origen}
        />
      </FormGroup>
      <FormGroup>
        <Label for="destino">Destino</Label>
        <Input
          type="text"
          name="destino"
          id="destino"
          onChange={onChange}
          value={form.destino === null ? "" : form.destino}
        />
      </FormGroup>
      <FormGroup>
        <Label for="fechaViajeFecha">Fecha de Viaje</Label>
        <Input
          type="date"
          name="fechaViajeFecha"
          id="fechaViajeFecha"
          onChange={onChange}
          value={form.fechaViajeFecha === null ? "" : form.fechaViajeFecha}
        />
      </FormGroup>
      <FormGroup>
        <Label for="fechaViajeHora">Hora de Viaje</Label>
        <Input
          type="time"
          name="fechaViajeHora"
          id="fechaViajeHora"
          onChange={onChange}
          value={form.fechaViajeHora === null ? "" : form.fechaViajeHora}
        />
      </FormGroup>

      <FormGroup>
        <Label for="Buses_idBus">Bus</Label>
        <Input
          type="select"
          name="Buses_idBus"
          id="Buses_idBus"
          onChange={onChange}
          value={form.Buses_idBus}
        >
          <option value="0">Seleccione un bus</option>
          {buses.map((bus) => {
            return (
              <option key={bus.idBus} value={bus.idBus}>
                {bus.placa}
              </option>
            );
          })}
        </Input>
      </FormGroup>
      <FormGroup>
        <Label for="Oficinas_idOficina">Oficina</Label>
        <Input
          type="select"
          name="Oficinas_idOficina"
          id="Oficinas_idOficina"
          onChange={onChange}
          value={form.Oficinas_idOficina}
        >
          <option value="0">Seleccione una oficina</option>
          {oficinas.map((oficina) => {
            return (
              <option key={oficina.idOficina} value={oficina.idOficina}>
                {oficina.nombre}
              </option>
            );
          })}
        </Input>
      </FormGroup>
      <FormGroup>
        <Label for="idChofer1">Chofer 1</Label>
        <Input
          type="select"
          name="idChofer1"
          id="idChofer1"
          onChange={onChange}
          value={form.idChofer1}
        >
          <option value="0">Seleccione un Chofer</option>
          {choferes.map((chofer) => {
            return (
              <option key={chofer.idChofer} value={chofer.idChofer}>
                {chofer.nombre}
              </option>
            );
          })}
        </Input>
      </FormGroup>
      <FormGroup>
        <Label for="idChofer2">Chofer 2</Label>
        <Input
          type="select"
          name="idChofer2"
          id="idChofer2"
          onChange={onChange}
          value={form.idChofer2}
        >
          <option value="0">Seleccione un Chofer</option>
          {choferes.map((chofer) => {
            return (
              <option key={chofer.idChofer} value={chofer.idChofer}>
                {chofer.nombre}
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
