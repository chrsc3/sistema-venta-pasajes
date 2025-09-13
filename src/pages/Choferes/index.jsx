/* eslint-disable no-unused-vars */
import "./choferes.css";
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
import ChoferesCards from "./ChoferesCards";
import choferService from "../../services/choferes";

function Choferes(props) {
  const [choferes, setChoferes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChoferes, setFilteredChoferes] = useState([]);

  const getItems = () => {
    setLoading(true);
    choferService
      .getAll()
      .then((response) => {
        setChoferes(response);
        setFilteredChoferes(response);
      })
      .catch((error) => {
        console.error("Error al obtener choferes:", error);
        alert("Error al obtener choferes");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addItemToState = (chofer) => {
    const newChoferes = choferes.concat(chofer);
    setChoferes(newChoferes);
    filterChoferes(searchTerm, newChoferes);
  };

  const updateState = (chofer) => {
    const itemIndex = choferes.findIndex(
      (data) => data.idChofer === chofer.idChofer
    );
    const newArray = [
      ...choferes.slice(0, itemIndex),
      chofer,
      ...choferes.slice(itemIndex + 1),
    ];
    setChoferes(newArray);
    filterChoferes(searchTerm, newArray);
  };

  const deleteItemFromState = (id) => {
    const updatedItems = choferes.filter((chofer) => chofer.idChofer !== id);
    setChoferes(updatedItems);
    filterChoferes(searchTerm, updatedItems);
  };

  const filterChoferes = (term, choferesArray = choferes) => {
    if (!term) {
      setFilteredChoferes(choferesArray);
    } else {
      const filtered = choferesArray.filter(chofer =>
        chofer.nombre.toLowerCase().includes(term.toLowerCase()) ||
        chofer.telefono?.toLowerCase().includes(term.toLowerCase()) ||
        chofer.numLicencia?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredChoferes(filtered);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterChoferes(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredChoferes(choferes);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div>
      {/* Header mejorado */}
      <div className="choferes-header">
        <Container>
          <Row className="align-items-center">
            <Col md="8">
              <h1>
                <i className="fas fa-users mr-3"></i>
                Gestión de Choferes
              </h1>
              <p className="mb-0 mt-2" style={{opacity: 0.9}}>
                Administra los choferes de la flota El Chaqueño
              </p>
            </Col>
            <Col md="4">
              <div className="choferes-stats text-center">
                <h3 className="mb-1">{choferes.length}</h3>
                <small>Choferes Registrados</small>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="choferes mt-4">
        {/* Barra de búsqueda y estadísticas */}
        <Row className="mb-4">
          <Col md="8">
            <Card className="shadow-sm">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">
                    <i className="fas fa-search mr-2 text-primary"></i>
                    Buscar Choferes
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
                    placeholder="Buscar por nombre, teléfono o licencia..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
                {searchTerm && (
                  <small className="text-muted mt-2 d-block">
                    Mostrando {filteredChoferes.length} de {choferes.length} choferes
                  </small>
                )}
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="shadow-sm">
              <CardBody className="text-center">
                <h6 className="text-muted mb-2">Acciones Rápidas</h6>
                <ModalForm
                  buttonLabel="Añadir Chofer"
                  addItemToState={addItemToState}
                  buttonProps={{
                    color: "success",
                    size: "lg",
                    block: true
                  }}
                />
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
                  <h5 className="text-muted">Cargando choferes...</h5>
                </CardBody>
              </Card>
            </Col>
          </Row>
        ) : (
          <>
            {/* Tarjetas de choferes */}
            <ChoferesCards
              items={filteredChoferes}
              updateState={updateState}
              deleteItemFromState={deleteItemFromState}
            />

            {/* Mensaje cuando no hay resultados de búsqueda */}
            {searchTerm && filteredChoferes.length === 0 && (
              <Row>
                <Col>
                  <Alert color="info" className="text-center">
                    <i className="fas fa-search fa-2x mb-3"></i>
                    <h5>No se encontraron choferes</h5>
                    <p className="mb-0">
                      No hay choferes que coincidan con "{searchTerm}". 
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
              className: "add-chofer-btn"
            }}
          />
        </div>
      </Container>
    </div>
  );
}

export default Choferes;
