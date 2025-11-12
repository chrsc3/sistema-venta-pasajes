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
  Alert,
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
      const filtered = choferesArray.filter(
        (chofer) =>
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
    <div className="page-container fade-in">
      {/* Header unificado */}
      <div className="page-header">
        <h1>
          <i className="fas fa-id-card mr-3"></i>
          Gestión de Choferes
        </h1>
        <p className="page-header-subtitle">
          Administra los choferes de la flota El Chaqueño
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
                    placeholder="Buscar por nombre, teléfono o licencia..."
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
                buttonLabel="Añadir Chofer"
                addItemToState={addItemToState}
              />
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
          {/* Tarjetas de choferes */}
          <Container>
            <ChoferesCards
              items={filteredChoferes}
              updateState={updateState}
              deleteItemFromState={deleteItemFromState}
            />

            {/* Mensaje cuando no hay resultados de búsqueda */}
            {searchTerm && filteredChoferes.length === 0 && (
              <div className="empty-state">
                <i className="fas fa-id-card"></i>
                <h4>No se encontraron choferes</h4>
                <p>No hay choferes que coincidan con "{searchTerm}"</p>
              </div>
            )}
          </Container>
        </>
      )}
    </div>
  );
}

export default Choferes;
