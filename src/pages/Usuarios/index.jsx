/* eslint-disable no-unused-vars */
import "./usuarios.css";
import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Badge,
  InputGroup,
  Input,
  InputGroupText,
  Alert,
} from "reactstrap";
import ModalForm from "./Modal";
import UsuariosCards from "./UsuariosCards";
import userService from "../../services/user";
import { CSVLink } from "react-csv";

function Usuarios(props) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);

  const getItems = () => {
    setLoading(true);
    userService
      .getAll()
      .then((response) => {
        setUsuarios(response);
        setFilteredUsuarios(response);
      })
      .catch((error) => {
        console.error("Error al obtener usuarios:", error);
        alert("Error al obtener usuarios");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addItemToState = (usuario) => {
    const newUsuarios = usuarios.concat(usuario);
    setUsuarios(newUsuarios);
    filterUsuarios(searchTerm, newUsuarios);
  };

  const updateState = (usuario) => {
    const itemIndex = usuarios.findIndex(
      (data) => data.idUsuario === usuario.idUsuario
    );
    const newArray = [
      ...usuarios.slice(0, itemIndex),
      usuario,
      ...usuarios.slice(itemIndex + 1),
    ];
    setUsuarios(newArray);
    filterUsuarios(searchTerm, newArray);
  };

  const deleteItemFromState = (id) => {
    const updatedItems = usuarios.filter((usuario) => usuario.idUsuario !== id);
    setUsuarios(updatedItems);
    filterUsuarios(searchTerm, updatedItems);
  };

  const filterUsuarios = (term, usuariosArray = usuarios) => {
    if (!term) {
      setFilteredUsuarios(usuariosArray);
    } else {
      const filtered = usuariosArray.filter(
        (usuario) =>
          usuario.nombre?.toLowerCase().includes(term.toLowerCase()) ||
          usuario.apellido?.toLowerCase().includes(term.toLowerCase()) ||
          usuario.user?.toLowerCase().includes(term.toLowerCase()) ||
          usuario.telefono?.toLowerCase().includes(term.toLowerCase()) ||
          usuario.direccion?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsuarios(filtered);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterUsuarios(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredUsuarios(usuarios);
  };

  // Preparar datos para CSV
  const csvData = usuarios.map((usuario) => ({
    ID: usuario.idUsuario,
    Nombre: usuario.nombre,
    Apellido: usuario.apellido,
    Usuario: usuario.user,
    Telefono: usuario.telefono,
    Direccion: usuario.direccion,
  }));

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className="page-container fade-in">
      {/* Header unificado */}
      <div className="page-header">
        <h1>
          <i className="fas fa-users-cog mr-3"></i>
          Gestión de Usuarios
        </h1>
        <p className="page-header-subtitle">
          Administra los usuarios del sistema de venta de pasajes
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
                    placeholder="Buscar por nombre, apellido, usuario o teléfono..."
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
                buttonLabel="Añadir Usuario"
                addItemToState={addItemToState}
              />
              {usuarios.length > 0 && (
                <CSVLink
                  data={csvData}
                  filename={`usuarios_${
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

      {/* Estado de carga */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Tarjetas de usuarios */}
          <Container>
            <UsuariosCards
              items={filteredUsuarios}
              updateState={updateState}
              deleteItemFromState={deleteItemFromState}
            />

            {/* Mensaje cuando no hay resultados de búsqueda */}
            {searchTerm && filteredUsuarios.length === 0 && (
              <div className="empty-state">
                <i className="fas fa-users-cog"></i>
                <h4>No se encontraron usuarios</h4>
                <p>No hay usuarios que coincidan con "{searchTerm}"</p>
              </div>
            )}
          </Container>
        </>
      )}
    </div>
  );
}

export default Usuarios;
