/* eslint-disable no-unused-vars */
import "./roles.css";
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
import rolesService from "../../services/roles";
import { CSVLink } from "react-csv";

function Roles(props) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRoles, setFilteredRoles] = useState([]);

  const getItems = () => {
    setLoading(true);
    rolesService
      .getAll()
      .then((response) => {
        setRoles(response);
        setFilteredRoles(response);
      })
      .catch((error) => {
        console.error("Error al obtener roles:", error);
        alert("Error al obtener roles");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addItemToState = (rol) => {
    getItems(); // Recargar todos los roles después de agregar
  };

  const updateState = (rol) => {
    const updatedItems = roles.map((item) => {
      if (item.idRol === rol.idRol) {
        return rol;
      }
      return item;
    });
    setRoles(updatedItems);
    filterRoles(searchTerm, updatedItems);
  };

  const deleteItemFromState = (id) => {
    console.log(id);
    const updatedItems = roles.filter((rol) => rol.idRol !== id);
    setRoles(updatedItems);
    filterRoles(searchTerm, updatedItems);
  };

  const filterRoles = (term, rolesArray = roles) => {
    if (!term) {
      setFilteredRoles(rolesArray);
    } else {
      const filtered = rolesArray.filter((rol) =>
        rol.nombreRol?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredRoles(filtered);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterRoles(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredRoles(roles);
  };

  useEffect(() => {
    getItems();
  }, []);

  // Preparar datos para CSV
  const csvData = roles.map((rol) => ({
    ID: rol.idRol,
    Nombre: rol.nombreRol,
    Permisos: rol.Permisos?.map((p) => p.nombre).join(", ") || "Sin permisos",
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
          <i className="fas fa-user-shield mr-3"></i>
          Gestión de Roles
        </h1>
        <p className="page-header-subtitle">
          Configura roles y permisos del sistema
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
                    placeholder="Buscar roles..."
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
                buttonLabel="Añadir Rol"
                addItemToState={addItemToState}
              />
              {roles.length > 0 && (
                <CSVLink
                  data={csvData}
                  filename={`roles_${
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
          {filteredRoles.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-user-shield"></i>
              <h4>No se encontraron roles</h4>
              <p>
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza agregando un nuevo rol al sistema"}
              </p>
            </div>
          ) : (
            <DataTable
              items={filteredRoles}
              updateState={updateState}
              deleteItemFromState={deleteItemFromState}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Roles;
