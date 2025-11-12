/* eslint-disable no-unused-vars */
import "./oficinas.css";
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
import oficinaService from "../../services/oficinas";
import { CSVLink } from "react-csv";

function Oficinas(props) {
  const [oficinas, setOficinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOficinas, setFilteredOficinas] = useState([]);

  const getItems = () => {
    setLoading(true);
    oficinaService
      .getAll()
      .then((response) => {
        setOficinas(response);
        setFilteredOficinas(response);
      })
      .catch((error) => {
        console.error("Error al obtener oficinas:", error);
        alert("Error al obtener oficinas");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addItemToState = (oficina) => {
    const newOficinas = oficinas.concat(oficina);
    setOficinas(newOficinas);
    filterOficinas(searchTerm, newOficinas);
  };

  const updateState = (oficina) => {
    const itemIndex = oficinas.findIndex(
      (data) => data.idOficina === oficina.idOficina
    );
    const newArray = [
      ...oficinas.slice(0, itemIndex),
      oficina,
      ...oficinas.slice(itemIndex + 1),
    ];
    setOficinas(newArray);
    filterOficinas(searchTerm, newArray);
  };

  const deleteItemFromState = (id) => {
    console.log(id);
    const updatedItems = oficinas.filter((oficina) => oficina.idOficina !== id);
    setOficinas(updatedItems);
    filterOficinas(searchTerm, updatedItems);
  };

  const filterOficinas = (term, oficinasArray = oficinas) => {
    if (!term) {
      setFilteredOficinas(oficinasArray);
    } else {
      const filtered = oficinasArray.filter(
        (oficina) =>
          oficina.ciudad?.toLowerCase().includes(term.toLowerCase()) ||
          oficina.direccion?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredOficinas(filtered);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterOficinas(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredOficinas(oficinas);
  };

  useEffect(() => {
    getItems();
  }, []);

  // Preparar datos para CSV
  const csvData = oficinas.map((oficina) => ({
    ID: oficina.idOficina,
    Ciudad: oficina.ciudad,
    Dirección: oficina.direccion,
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
          <i className="fas fa-building mr-3"></i>
          Gestión de Oficinas
        </h1>
        <p className="page-header-subtitle">
          Administra las sucursales y puntos de venta
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
                    placeholder="Buscar por ciudad o dirección..."
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
                buttonLabel="Añadir Oficina"
                addItemToState={addItemToState}
              />
              {oficinas.length > 0 && (
                <CSVLink
                  data={csvData}
                  filename={`oficinas_${
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
          {filteredOficinas.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-building"></i>
              <h4>No se encontraron oficinas</h4>
              <p>
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza agregando una nueva oficina al sistema"}
              </p>
            </div>
          ) : (
            <DataTable
              items={filteredOficinas}
              updateState={updateState}
              deleteItemFromState={deleteItemFromState}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Oficinas;
