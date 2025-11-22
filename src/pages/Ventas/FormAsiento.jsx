/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { UserContext } from "../../context/userContext";
import boletoService from "../../services/boletos";
import clientesService from "../../services/clientes";
import pagosService from "../../services/pagos";
import ticket from "../../utils/ticketBoleto";

function AddPasajeroForm(props) {
  const User = useContext(UserContext);
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
    Usuarios_idUsuario: User.user.idUsuario,
  });
  const [clientes, setClientes] = useState([]);
  const [selectedClienteId, setSelectedClienteId] = useState(null);
  const [filtroCliente, setFiltroCliente] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const onChangePrecio = (e) => {
    setPrecioPasaje(e.target.value);
  };

  const submitFormAdd = (e, esReserva = false) => {
    e.preventDefault();
    const data = {
      ...form,
      total: detalleBoleto.length * precioPasaje,
      Usuarios_idUsuario: User.user.idUsuario,
      esReserva: esReserva,
      detalleBoleto: detalleBoleto.map((detalle) => ({
        ...detalle,
        precio: precioPasaje,
      })),
      ...(selectedClienteId ? { Clientes_idCliente: selectedClienteId } : {}),
    };

    boletoService
      .create(data)
      .then(async (response) => {
        // Solo crear pago si es venta, no si es reserva
        if (!esReserva) {
          try {
            await pagosService.crearPago({
              monto: data.total,
              metodo: metodoPago,
              Boletos_idBoleto: response.idBoleto,
              Usuarios_idUsuario: User.user.idUsuario,
            });
          } catch (errPago) {
            console.error("Error creando pago:", errPago);
            Swal.fire({
              icon: "warning",
              title: "Boleto creado, pago falló",
              text: "El boleto se creó pero el registro del pago falló.",
            });
          }
          Swal.fire({
            icon: "success",
            title: "Venta registrada",
            text: "Boleto y pago registrados exitosamente",
          });
          ticket("print", response);
        } else {
          Swal.fire({
            icon: "success",
            title: "Reserva registrada",
            text: "La reserva ha sido registrada exitosamente",
          });
        }
        props.toggle();
        props.onChangeBoletoRealizado(esReserva);
      })
      .catch((error) => {
        console.error("Error adding boleto:", error);
        const message =
          error?.response?.data?.error ||
          "Error al crear el boleto: Datos inválidos";
        Swal.fire({
          icon: "error",
          title: "No se pudo vender",
          text: message,
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
      asientosSelcionados?.length > 0 &&
        setValues({
          nombre: asientosSelcionados[0].nombre,
          ci: asientosSelcionados[0].ci,
        });
    }
    // cargar clientes una sola vez
    clientesService
      .getAll()
      .then((data) => setClientes(data))
      .catch((err) => console.error("Error cargando clientes", err));
  }, [props.item, props.selectAsientos]);

  const onSelectCliente = (e) => {
    const id = e.target.value ? parseInt(e.target.value) : null;
    setSelectedClienteId(id);
    if (!id) return;
    const cliente = clientes.find((c) => c.idCliente === id);
    if (cliente) {
      setValues({ ...form, nombre: cliente.nombre, ci: cliente.ci });
      // reflejar en cada asiento
      setDetalleBoleto(
        detalleBoleto.map((d) => ({
          ...d,
          nombre: cliente.nombre,
          ci: cliente.ci,
        }))
      );
    }
  };

  const clientesFiltrados = clientes.filter((c) => {
    if (!filtroCliente) return true;
    const lower = filtroCliente.toLowerCase();
    return [c.nombre, c.apellido, c.ci, c.telefono, c.email]
      .filter(Boolean)
      .some((v) => v.toLowerCase().includes(lower));
  });

  return (
    <Form onSubmit={(e) => submitFormAdd(e, false)}>
      <FormGroup>
        <Label for="clienteSelect">Cliente (opcional)</Label>
        <Input
          type="text"
          placeholder="Filtrar cliente por nombre, CI..."
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
          className="mb-2"
        />
        <Input
          type="select"
          name="clienteSelect"
          id="clienteSelect"
          value={selectedClienteId || ""}
          onChange={onSelectCliente}
        >
          <option value="">-- Seleccionar cliente --</option>
          {clientesFiltrados.map((c) => (
            <option key={c.idCliente} value={c.idCliente}>
              {c.idCliente} - {[c.nombre, c.apellido].filter(Boolean).join(" ")}{" "}
              ({c.ci})
            </option>
          ))}
        </Input>
        {selectedClienteId && (
          <Button
            size="sm"
            color="secondary"
            className="mt-2"
            onClick={() => {
              setSelectedClienteId(null);
              setValues({ ...form, nombre: "", ci: "" });
            }}
          >
            Limpiar selección
          </Button>
        )}
      </FormGroup>
      <FormGroup>
        <Label for="nombre">Nombre para el Boleto</Label>
        <Input
          type="text"
          name="nombre"
          id="nombre"
          onChange={onChange}
          value={form.nombre === null ? "" : form.nombre}
          required
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
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="precioPasaje">Precio del Pasaje</Label>
        <Input
          type="number"
          name="precioPasaje"
          id="precioPasaje"
          onChange={onChangePrecio}
          value={precioPasaje === null ? "" : precioPasaje}
          required
          min="0"
          step="0.01"
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
          <Label>Bs. {(detalleBoleto.length * precioPasaje).toFixed(2)}</Label>
        </div>
      </FormGroup>
      <FormGroup>
        <Label for="metodoPago">Método de Pago</Label>
        <Input
          type="select"
          name="metodoPago"
          id="metodoPago"
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
        >
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
          <option value="QR">QR</option>
        </Input>
      </FormGroup>
      <div style={{ display: "flex", gap: "10px" }}>
        <Button color="success" type="submit">
          Vender
        </Button>
        <Button
          color="info"
          type="button"
          onClick={(e) => submitFormAdd(e, true)}
        >
          Reservar
        </Button>
      </div>
    </Form>
  );
}

export default AddPasajeroForm;
