/* eslint-disable no-unused-vars */
import "./viajes.css";
import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  InputGroup,
  Input,
  InputGroupText,
} from "reactstrap";
import ModalForm from "./Modal";
import DataTable from "./Lista";
import viajeService from "../../services/viajes";
import busService from "../../services/buses";
import { CSVLink } from "react-csv";

function Viajes(props) {
  const [viajes, setViajes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredViajes, setFilteredViajes] = useState([]);

  const getItems = () => {
    setLoading(true);
    // Para administración queremos TODOS los viajes (incluye pasados) ordenados de más reciente a más antiguo
    Promise.all([viajeService.getAllAdmin(), busService.getAll()])
      .then(([viajesResponse, busesResponse]) => {
        // Orden de seguridad en cliente (backend ya devuelve DESC)
        const sorted = [...viajesResponse].sort((a, b) => {
          try {
            const da = new Date(`${a.fechaViaje.fecha}T${a.fechaViaje.hora}`);
            const db = new Date(`${b.fechaViaje.fecha}T${b.fechaViaje.hora}`);
            return db - da; // más reciente primero
          } catch (e) {
            return 0;
          }
        });
        setViajes(sorted);
        setFilteredViajes(sorted);
        setBuses(busesResponse);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
        alert("Error al obtener viajes");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addItemToState = (viaje) => {
    const newViajes = viajes.concat(viaje);
    setViajes(newViajes);
    filterViajes(searchTerm, newViajes);
  };

  const updateState = (viaje) => {
    const itemIndex = viajes.findIndex(
      (data) => data.idViaje === viaje.idViaje
    );
    const newArray = [
      ...viajes.slice(0, itemIndex),
      viaje,
      ...viajes.slice(itemIndex + 1),
    ];
    setViajes(newArray);
    filterViajes(searchTerm, newArray);
  };

  const deleteItemFromState = (id) => {
    console.log(id);
    const updatedItems = viajes.filter((viaje) => viaje.idViaje !== id);
    setViajes(updatedItems);
    filterViajes(searchTerm, updatedItems);
  };

  const filterViajes = (term, viajesArray = viajes) => {
    if (!term) {
      setFilteredViajes(viajesArray);
    } else {
      const filtered = viajesArray.filter(
        (viaje) =>
          viaje.origen?.toLowerCase().includes(term.toLowerCase()) ||
          viaje.destino?.toLowerCase().includes(term.toLowerCase()) ||
          viaje.Bus?.placa?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredViajes(filtered);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterViajes(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredViajes(viajes);
  };

  useEffect(() => {
    getItems();
  }, []);

  // Preparar datos para CSV
  const csvData = viajes.map((viaje) => ({
    ID: viaje.idViaje,
    Origen: viaje.origen,
    Destino: viaje.destino,
    "Fecha Salida": viaje.fechaSalida,
    "Fecha Llegada": viaje.fechaLlegada,
    Precio: viaje.precio,
    Bus: viaje.Bus?.placa || "No asignado",
  }));

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="page-header">
        <h1>
          <i className="fas fa-route mr-3"></i>
          Gestión de Viajes
        </h1>
        <p className="page-header-subtitle">
          Programa y administra las rutas de transporte
        </p>
      </div>

      {/* Barra de acciones */}
      <Card className="page-actions">
        <CardBody>
          <Row className="align-items-center">
            <Col md="6" className="mb-3 mb-md-0">
              <div className="search-bar">
                <InputGroup>
                  <InputGroupText>
                    <i className="fas fa-search"></i>
                  </InputGroupText>
                  <Input
                    type="text"
                    placeholder="Buscar por origen, destino o bus..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  {searchTerm && (
                    <Button color="light" onClick={clearSearch}>
                      <i className="fas fa-times"></i>
                    </Button>
                  )}
                </InputGroup>
              </div>
            </Col>
            <Col md="6" className="text-md-right">
              <ModalForm
                buttonLabel="Añadir Viaje"
                addItemToState={addItemToState}
              />
              {viajes.length > 0 && (
                <CSVLink
                  data={csvData}
                  filename={`viajes_${
                    new Date().toISOString().split("T")[0]
                  }.csv`}
                  className="btn btn-success ml-2"
                >
                  <i className="fas fa-file-csv mr-2"></i>
                  Exportar CSV
                </CSVLink>
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Contenido */}
      <div className="content-card">
        <div className="content-card-body">
          {filteredViajes.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-route"></i>
              <h4>No se encontraron viajes</h4>
              <p>
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza programando un nuevo viaje"}
              </p>
            </div>
          ) : (
            <DataTable
              items={filteredViajes}
              buses={buses}
              updateState={updateState}
              deleteItemFromState={deleteItemFromState}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Viajes;
