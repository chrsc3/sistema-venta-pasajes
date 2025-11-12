/* eslint-disable no-unused-vars */
import "./buses.css";
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
import busService from "../../services/buses";
import { CSVLink } from "react-csv";

function Buses(props) {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBuses, setFilteredBuses] = useState([]);

  const getItems = () => {
    setLoading(true);
    busService
      .getAll()
      .then((response) => {
        setBuses(response);
        setFilteredBuses(response);
      })
      .catch((error) => {
        console.error("Error al obtener buses:", error);
        alert("Error al obtener buses");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addItemToState = (bus) => {
    const newBuses = buses.concat(bus);
    setBuses(newBuses);
    filterBuses(searchTerm, newBuses);
  };

  const updateState = (bus) => {
    const itemIndex = buses.findIndex((data) => data.idBus === bus.idBus);
    const newArray = [
      ...buses.slice(0, itemIndex),
      bus,
      ...buses.slice(itemIndex + 1),
    ];
    setBuses(newArray);
    filterBuses(searchTerm, newArray);
  };

  const deleteItemFromState = (id) => {
    console.log(id);
    const updatedItems = buses.filter((bus) => bus.idBus !== id);
    setBuses(updatedItems);
    filterBuses(searchTerm, updatedItems);
  };

  const filterBuses = (term, busesArray = buses) => {
    if (!term) {
      setFilteredBuses(busesArray);
    } else {
      const filtered = busesArray.filter(
        (bus) =>
          bus.placa?.toLowerCase().includes(term.toLowerCase()) ||
          bus.modelo?.toLowerCase().includes(term.toLowerCase()) ||
          bus.marca?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredBuses(filtered);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterBuses(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredBuses(buses);
  };

  useEffect(() => {
    getItems();
  }, []);

  // Preparar datos para CSV
  const csvData = buses.map((bus) => ({
    ID: bus.idBus,
    Placa: bus.placa,
    Marca: bus.marca,
    Modelo: bus.modelo,
    "Asientos Planta Alta": bus.plantaAlta,
    "Asientos Planta Baja": bus.plantaBaja,
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
          <i className="fas fa-bus mr-3"></i>
          Gestión de Buses
        </h1>
        <p className="page-header-subtitle">
          Administra la flota de vehículos y sus configuraciones
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
                    placeholder="Buscar por placa, marca o modelo..."
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
                buttonLabel="Añadir Bus"
                addItemToState={addItemToState}
              />
              {buses.length > 0 && (
                <CSVLink
                  data={csvData}
                  filename={`buses_${
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
          {filteredBuses.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-bus"></i>
              <h4>No se encontraron buses</h4>
              <p>
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza agregando un nuevo bus al sistema"}
              </p>
            </div>
          ) : (
            <DataTable
              items={filteredBuses}
              updateState={updateState}
              deleteItemFromState={deleteItemFromState}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Buses;
