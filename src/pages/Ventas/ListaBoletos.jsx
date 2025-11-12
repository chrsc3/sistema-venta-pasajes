/* eslint-disable react/prop-types */
import { Table, Button, Badge } from "reactstrap";
import boletosService from "../../services/boletos";
import pagosService from "../../services/pagos";
import PrintBoleto from "../../components/printBoleto"; // Asegúrate de que la ruta sea correcta
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import PrintListaBoletos from "../../components/printListaBoletos"; // Asegúrate de que la ruta sea correcta
import Swal from "sweetalert2";

function ListaBoletos(props) {
  const User = useContext(UserContext);
  const [boletos, setBoletos] = useState([]);

  const confirmarReserva = async (boleto) => {
    // Paso 1: Solicitar el monto (con opción de modificar)
    const { value: nuevoMonto } = await Swal.fire({
      title: "Confirmar Reserva - Monto",
      html: `
        <p><strong>Cliente:</strong> ${boleto.nombre}</p>
        <p><strong>Monto original:</strong> Bs. ${boleto.total}</p>
        <p>Ingrese el monto a cobrar:</p>
      `,
      input: "number",
      inputValue: boleto.total,
      inputAttributes: {
        min: 0,
        step: "0.01",
      },
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value || parseFloat(value) <= 0) {
          return "Debe ingresar un monto válido mayor a 0";
        }
      },
    });

    if (!nuevoMonto) return; // Usuario canceló

    // Paso 2: Solicitar método de pago
    const { value: metodoPago } = await Swal.fire({
      title: "Confirmar Reserva - Método de Pago",
      html: `
        <p><strong>Cliente:</strong> ${boleto.nombre}</p>
        <p><strong>Monto a cobrar:</strong> Bs. ${parseFloat(
          nuevoMonto
        ).toFixed(2)}</p>
        <p>Seleccione el método de pago:</p>
      `,
      input: "select",
      inputOptions: {
        efectivo: "Efectivo",
        tarjeta: "Tarjeta",
        transferencia: "Transferencia",
        QR: "QR",
      },
      inputPlaceholder: "Método de pago",
      showCancelButton: true,
      confirmButtonText: "Confirmar Venta",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "Debe seleccionar un método de pago";
        }
      },
    });

    if (metodoPago) {
      try {
        // Confirmar la reserva (cambiar estado a 'activo' y actualizar monto)
        await boletosService.confirmarReserva(
          boleto.idBoleto,
          parseFloat(nuevoMonto)
        );

        // Crear el pago
        await pagosService.crearPago({
          monto: parseFloat(nuevoMonto),
          metodo: metodoPago,
          Boletos_idBoleto: boleto.idBoleto,
          Usuarios_idUsuario: User.user.idUsuario,
        });

        Swal.fire({
          icon: "success",
          title: "Reserva Confirmada",
          text: `La reserva se ha convertido en venta exitosamente. Monto: Bs. ${parseFloat(
            nuevoMonto
          ).toFixed(2)}`,
        });

        // Recargar la lista de boletos
        recargarBoletos();

        // Notificar al componente padre para recargar asientos
        if (props.onBoletoActualizado) {
          props.onBoletoActualizado();
        }
      } catch (error) {
        console.error("Error confirmando reserva:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo confirmar la reserva",
        });
      }
    }
  };

  const anularBoleto = async (boleto) => {
    const result = await Swal.fire({
      title: "¿Anular este boleto?",
      html: `
        <p><strong>Cliente:</strong> ${boleto.nombre}</p>
        <p><strong>CI:</strong> ${boleto.ci}</p>
        <p><strong>Total:</strong> Bs. ${boleto.total}</p>
        <p><strong>Estado:</strong> ${
          boleto.estado === "reserva" ? "Reserva" : "Venta"
        }</p>
        <br/>
        <p style="color: #d33;">Esta acción liberará los asientos y marcará el boleto como anulado.</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, anular",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await boletosService.anularBoleto(boleto.idBoleto);

        Swal.fire({
          icon: "success",
          title: "Boleto Anulado",
          text: "El boleto ha sido anulado y los asientos han sido liberados",
        });

        // Recargar la lista de boletos
        recargarBoletos();

        // Notificar al componente padre para recargar asientos
        if (props.onBoletoActualizado) {
          props.onBoletoActualizado();
        }
      } catch (error) {
        console.error("Error anulando boleto:", error);
        const errorMessage =
          error.response?.data?.error || "No se pudo anular el boleto";
        Swal.fire({
          icon: "error",
          title: "Error al Anular",
          text: errorMessage,
        });
      }
    }
  };

  const recargarBoletos = () => {
    if (props.viaje) {
      boletosService
        .getOne(props.viaje.idViaje)
        .then((boletos) => {
          setBoletos(boletos);
        })
        .catch((error) => {
          console.error("Error al obtener boletos", error);
        });
    }
  };

  useEffect(() => {
    if (!props.viaje) {
      return;
    } else {
      boletosService
        .getOne(props.viaje.idViaje)
        .then((boletos) => {
          setBoletos(boletos);
        })
        .catch((error) => {
          alert("Error al obtener boletos", error);
        });
    }
  }, [props.viaje, props.boletoRealizado]);

  const getEstadoBadge = (estado) => {
    if (estado === "reserva") {
      return <Badge color="info">Reserva</Badge>;
    } else if (estado === "activo") {
      return <Badge color="success">Venta</Badge>;
    } else if (estado === "anulado") {
      return <Badge color="secondary">Anulado</Badge>;
    }
    return <Badge color="secondary">{estado}</Badge>;
  };

  const items = boletos.map((boleto) => {
    const esReserva = boleto.estado === "reserva";
    const esAnulado = boleto.estado === "anulado";

    return (
      <tr
        key={boleto.idBoleto}
        style={{
          backgroundColor: esReserva
            ? "#e7f4ff"
            : esAnulado
            ? "#f0f0f0"
            : "transparent",
        }}
      >
        <th scope="row">{boleto.idBoleto}</th>
        <td>{boleto.nombre}</td>
        <td>{boleto.ci}</td>
        <td>{boleto.fecha.fecha}</td>
        <td>Bs. {parseFloat(boleto.total).toFixed(2)}</td>
        <td>{getEstadoBadge(boleto.estado)}</td>
        <td>
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {esReserva && (
              <Button
                color="primary"
                size="sm"
                onClick={() => confirmarReserva(boleto)}
                title="Confirmar reserva y registrar pago"
              >
                Confirmar
              </Button>
            )}
            {!esAnulado && (
              <>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => anularBoleto(boleto)}
                >
                  Anular
                </Button>
                <PrintBoleto boleto={boleto} />
              </>
            )}
          </div>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <PrintListaBoletos
        detalleBoletos={boletos
          .map((boleto) => {
            return boleto.detalle_boletos.map((detalle) => ({
              idDetalle_Boleto: boleto.idDetalle_Boleto,
              nombre: detalle.nombre,
              ci: detalle.ci,
            }));
          })
          .flat()}
      />
      <Table responsive hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Pasajero</th>
            <th>CI</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </Table>
      <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
        <p>
          <strong>Leyenda:</strong> <Badge color="info">Reserva</Badge> -
          Pendiente de pago | <Badge color="success">Venta</Badge> - Pagado |{" "}
          <Badge color="secondary">Anulado</Badge> - Cancelado
        </p>
      </div>
    </div>
  );
}

export default ListaBoletos;
