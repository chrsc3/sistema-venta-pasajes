import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  InputGroupText,
  Badge,
  Spinner,
} from "reactstrap";
import viajesService from "../../services/viajes";
import "./ventasnav.css";

const VentasNav = () => {
  const [viajes, setViajes] = useState([]);
  const [filteredViajes, setFilteredViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("todos");

  const navigate = useNavigate();

  const navigateToVentas = (idViaje) => {
    navigate(`/ventas/${idViaje}`);
  };

  const loadViajes = async () => {
    try {
      setLoading(true);
      const data = await viajesService.getAll();
      setViajes(data);
      setFilteredViajes(data);
    } catch (error) {
      console.error("Error al cargar viajes:", error);
      alert("Error al cargar los viajes disponibles");
    } finally {
      setLoading(false);
    }
  };

  const filterViajes = (term, filter) => {
    let filtered = [...viajes];

    // Filtrar por búsqueda de texto
    if (term) {
      filtered = filtered.filter(
        (viaje) =>
          viaje.origen?.toLowerCase().includes(term.toLowerCase()) ||
          viaje.destino?.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Filtrar por fecha
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case "hoy":
        filtered = filtered.filter((viaje) => {
          const fechaViaje = new Date(
            `${viaje.fechaViaje.fecha}T${viaje.fechaViaje.hora}`
          );
          fechaViaje.setHours(0, 0, 0, 0);
          return fechaViaje.getTime() === today.getTime();
        });
        break;
      case "proximos":
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        filtered = filtered.filter((viaje) => {
          const fechaViaje = new Date(
            `${viaje.fechaViaje.fecha}T${viaje.fechaViaje.hora}`
          );
          return fechaViaje >= today && fechaViaje <= nextWeek;
        });
        break;
      case "todos":
      default:
        // Mostrar todos
        break;
    }

    setFilteredViajes(filtered);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterViajes(term, selectedFilter);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    filterViajes(searchTerm, filter);
  };

  const clearSearch = () => {
    setSearchTerm("");
    filterViajes("", selectedFilter);
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      activo: "success",
      cancelado: "danger",
      inactivo: "secondary",
      completado: "info",
    };
    return badges[estado] || "secondary";
  };

  const formatHora = (hora) => {
    if (!hora) return "";
    return hora.substring(0, 5); // HH:MM
  };

  useEffect(() => {
    loadViajes();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner color="primary" size="lg" />
        <p className="mt-3">Cargando viajes disponibles...</p>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="page-header">
        <Container>
          <h1>
            <i className="fas fa-ticket-alt mr-3"></i>
            Punto de Venta
          </h1>
          <p className="page-header-subtitle">
            Selecciona un viaje para iniciar la venta de pasajes
          </p>
        </Container>
      </div>

      <Container>
        {/* Barra de búsqueda y filtros */}
        <Card className="page-actions mb-4">
          <CardBody>
            <Row className="align-items-center">
              <Col md="8" className="mb-3 mb-md-0">
                <div className="search-bar">
                  <InputGroup>
                    <InputGroupText>
                      <i className="fas fa-search"></i>
                    </InputGroupText>
                    <Input
                      type="text"
                      placeholder="Buscar por origen o destino..."
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
              <Col md="4">
                <div className="filter-buttons">
                  <Button
                    size="sm"
                    color={selectedFilter === "todos" ? "primary" : "light"}
                    onClick={() => handleFilterChange("todos")}
                    className="mr-2"
                  >
                    Todos
                  </Button>
                  <Button
                    size="sm"
                    color={selectedFilter === "hoy" ? "primary" : "light"}
                    onClick={() => handleFilterChange("hoy")}
                    className="mr-2"
                  >
                    Hoy
                  </Button>
                  <Button
                    size="sm"
                    color={selectedFilter === "proximos" ? "primary" : "light"}
                    onClick={() => handleFilterChange("proximos")}
                  >
                    Próximos 7 días
                  </Button>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Resumen de resultados */}
        <div className="mb-3">
          <small className="text-muted">
            Mostrando {filteredViajes.length} de {viajes.length} viajes
            disponibles
          </small>
        </div>

        {/* Lista de viajes */}
        {filteredViajes.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-bus-alt"></i>
            <h4>No se encontraron viajes</h4>
            <p>
              {searchTerm
                ? "Intenta con otros términos de búsqueda"
                : "No hay viajes disponibles en este momento"}
            </p>
          </div>
        ) : (
          <Row>
            {filteredViajes.map((viaje) => (
              <Col key={viaje.idViaje} md="6" lg="4" className="mb-4">
                <Card className="viaje-card h-100">
                  <CardBody className="d-flex flex-column">
                    <div className="viaje-card-header mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="viaje-route mb-1">
                            <i className="fas fa-map-marker-alt text-primary"></i>{" "}
                            {viaje.origen}
                          </h5>
                          <div className="route-arrow">
                            <i className="fas fa-arrow-down"></i>
                          </div>
                          <h5 className="viaje-route mb-0">
                            <i className="fas fa-map-marker-alt text-danger"></i>{" "}
                            {viaje.destino}
                          </h5>
                        </div>
                        <Badge color={getEstadoBadge(viaje.estado)} pill>
                          {viaje.estado}
                        </Badge>
                      </div>
                    </div>

                    <div className="viaje-info mb-3">
                      <div className="info-item">
                        <i className="far fa-calendar"></i>
                        <span>{viaje.fechaViaje.fecha}</span>
                      </div>
                      <div className="info-item">
                        <i className="far fa-clock"></i>
                        <span>{formatHora(viaje.fechaViaje.hora)}</span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Button
                        color="primary"
                        block
                        onClick={() => navigateToVentas(viaje.idViaje)}
                        className="btn-vender"
                      >
                        <i className="fas fa-ticket-alt mr-2"></i>
                        Vender Pasajes
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Botón para recargar */}
        <div className="text-center mt-4">
          <Button color="light" onClick={loadViajes}>
            <i className="fas fa-sync-alt mr-2"></i>
            Actualizar Lista
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default VentasNav;
