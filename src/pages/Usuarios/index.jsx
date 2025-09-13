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
  Alert
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
      const filtered = usuariosArray.filter(usuario =>
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
  const csvData = usuarios.map(usuario => ({
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
    <div>
      {/* Header mejorado */}
      <div className="usuarios-header">
        <Container>
          <Row className="align-items-center">
            <Col md="8">
              <h1>
                <i className="fas fa-users mr-3"></i>
                Gestión de Usuarios
              </h1>
              <p className="mb-0 mt-2" style={{opacity: 0.9}}>
                Administra los usuarios del sistema de venta de pasajes
              </p>
            </Col>
            <Col md="4">
              <div className="usuarios-stats text-center">
                <h3 className="mb-1">{usuarios.length}</h3>
                <small>Usuarios Registrados</small>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="usuarios mt-4">
        {/* Barra de búsqueda y herramientas */}
        <Row className="mb-4">
          <Col md="8">
            <Card className="shadow-sm">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">
                    <i className="fas fa-search mr-2 text-primary"></i>
                    Buscar Usuarios
                  </h5>
                  {searchTerm && (
                    <Button 
                      color="secondary" 
                      size="sm" 
                      onClick={clearSearch}
                      outline
                    >
                      <i className="fas fa-times mr-1"></i>
                      Limpiar
                    </Button>
                  )}
                </div>
                <InputGroup>
                  <InputGroupText>
                    <i className="fas fa-search"></i>
                  </InputGroupText>
                  <Input
                    type="text"
                    placeholder="Buscar por nombre, apellido, usuario, teléfono o dirección..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
                {searchTerm && (
                  <small className="text-muted mt-2 d-block">
                    Mostrando {filteredUsuarios.length} de {usuarios.length} usuarios
                  </small>
                )}
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="shadow-sm">
              <CardBody>
                <h6 className="text-muted mb-3">Acciones Rápidas</h6>
                <ModalForm
                  buttonLabel="Añadir Usuario"
                  addItemToState={addItemToState}
                  buttonProps={{
                    color: "success",
                    size: "lg",
                    block: true,
                    className: "mb-2"
                  }}
                />
                {usuarios.length > 0 && (
                  <CSVLink
                    data={csvData}
                    filename="usuarios.csv"
                    className="btn btn-outline-primary btn-block"
                  >
                    <i className="fas fa-download mr-2"></i>
                    Exportar CSV
                  </CSVLink>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Estado de carga */}
        {loading ? (
          <Row>
            <Col>
              <Card className="text-center py-5">
                <CardBody>
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="sr-only">Cargando...</span>
                  </div>
                  <h5 className="text-muted">Cargando usuarios...</h5>
                </CardBody>
              </Card>
            </Col>
          </Row>
        ) : (
          <>
            {/* Tarjetas de usuarios */}
            <UsuariosCards
              items={filteredUsuarios}
              updateState={updateState}
              deleteItemFromState={deleteItemFromState}
            />

            {/* Mensaje cuando no hay resultados de búsqueda */}
            {searchTerm && filteredUsuarios.length === 0 && (
              <Row>
                <Col>
                  <Alert color="info" className="text-center">
                    <i className="fas fa-search fa-2x mb-3"></i>
                    <h5>No se encontraron usuarios</h5>
                    <p className="mb-0">
                      No hay usuarios que coincidan con "{searchTerm}". 
                      Intenta con otros términos de búsqueda.
                    </p>
                  </Alert>
                </Col>
              </Row>
            )}
          </>
        )}

        {/* Botón flotante para agregar (móvil) */}
        <div className="d-block d-md-none">
          <ModalForm
            buttonLabel={<i className="fas fa-plus"></i>}
            addItemToState={addItemToState}
            buttonProps={{
              color: "primary",
              className: "add-usuario-btn"
            }}
          />
        </div>
      </Container>
    </div>
  );
}

export default Usuarios;
