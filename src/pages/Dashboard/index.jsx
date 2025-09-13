import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Badge,
  Alert,
} from "reactstrap";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import Logo from "../../assets/LogoChaque.jpg";
import { useEffect, useState } from "react";
import dashboardService from "../../services/dashboard";

const Dashboard = () => {
  const [ventas, setVentas] = useState([]);
  const [ventasSemana, setVentasSemana] = useState({});
  const [ventasMes, setVentasMes] = useState({});
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);

  // Estados calculados para el día
  const [totalRecaudado, setTotalRecaudado] = useState(0);
  const [totalPasajeros, setTotalPasajeros] = useState(0);
  const [totalViajes, setTotalViajes] = useState(0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const loadData = async () => {
    try {
      setLoading(true);
      const [ventasHoy, ventasSem, ventasMensual, stats] = await Promise.all([
        dashboardService.getDay(),
        dashboardService.getWeek(),
        dashboardService.getMonth(),
        dashboardService.getStatistics(),
      ]);
      
      setVentas(ventasHoy);
      setVentasSemana(ventasSem);
      setVentasMes(ventasMensual);
      setEstadisticas(stats);
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTotalRecaudado(
      ventas.reduce((acc, venta) => acc + venta.totalRecaudado, 0)
    );
    setTotalPasajeros(
      ventas.reduce((acc, venta) => acc + venta.totalPasajeros, 0)
    );
    setTotalViajes(ventas.length);
  }, [ventas]);

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount);
  };

  if (loading) {
    return (
      <Container>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Cargando...</span>
          </div>
        </div>
      </Container>
    );
  }
  return (
    <Container fluid>
      {/* Título del Dashboard */}
      <Row className="mb-3">
        <Col>
          <h2 className="text-center text-primary mb-3">Flota El Chaqueño</h2>
        </Col>
      </Row>

      {/* Logo centrado debajo del título */}
      <Row className="mb-4">
        <Col className="text-center">
          <img 
            src={Logo} 
            alt="Logo Chaque" 
            style={{
              width: '150px',
              height: 'auto',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          />
        </Col>
      </Row>
      
      {/* Tarjetas de estadísticas del día */}
      <Row className="mb-4">
        <Col md="3">
          <Card className="border-left-primary shadow h-100 py-2" style={{borderLeft: '4px solid #4e73df'}}>
            <CardBody>
              <Row className="no-gutters align-items-center">
                <Col className="mr-2">
                  <CardTitle className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Pasajeros del Día
                  </CardTitle>
                  <CardText className="h5 mb-0 font-weight-bold text-gray-800">
                    {totalPasajeros}
                  </CardText>
                </Col>
                <Col xs="auto">
                  <i className="fas fa-users fa-2x text-gray-300"></i>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card className="border-left-success shadow h-100 py-2" style={{borderLeft: '4px solid #1cc88a'}}>
            <CardBody>
              <Row className="no-gutters align-items-center">
                <Col className="mr-2">
                  <CardTitle className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Ventas del Día
                  </CardTitle>
                  <CardText className="h5 mb-0 font-weight-bold text-gray-800">
                    {formatCurrency(totalRecaudado)}
                  </CardText>
                </Col>
                <Col xs="auto">
                  <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card className="border-left-info shadow h-100 py-2" style={{borderLeft: '4px solid #36b9cc'}}>
            <CardBody>
              <Row className="no-gutters align-items-center">
                <Col className="mr-2">
                  <CardTitle className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Viajes Activos
                  </CardTitle>
                  <CardText className="h5 mb-0 font-weight-bold text-gray-800">
                    {totalViajes}
                  </CardText>
                </Col>
                <Col xs="auto">
                  <i className="fas fa-bus fa-2x text-gray-300"></i>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card className="border-left-warning shadow h-100 py-2" style={{borderLeft: '4px solid #f6c23e'}}>
            <CardBody>
              <Row className="no-gutters align-items-center">
                <Col className="mr-2">
                  <CardTitle className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Total Buses
                  </CardTitle>
                  <CardText className="h5 mb-0 font-weight-bold text-gray-800">
                    {estadisticas.totalBuses || 0}
                  </CardText>
                </Col>
                <Col xs="auto">
                  <i className="fas fa-truck fa-2x text-gray-300"></i>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Tarjetas de estadísticas semanales y mensuales */}
      <Row className="mb-4">
        <Col md="4">
          <Card className="shadow">
            <CardBody>
              <CardTitle tag="h5" className="text-primary">
                <i className="fas fa-calendar-week mr-2"></i>
                Ventas de la Semana
              </CardTitle>
              <hr />
              <p><strong>Recaudado:</strong> {formatCurrency(ventasSemana.totalRecaudado || 0)}</p>
              <p><strong>Pasajeros:</strong> {ventasSemana.totalPasajeros || 0}</p>
              <p><strong>Boletos:</strong> {ventasSemana.totalBoletos || 0}</p>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card className="shadow">
            <CardBody>
              <CardTitle tag="h5" className="text-success">
                <i className="fas fa-calendar-alt mr-2"></i>
                Ventas del Mes
              </CardTitle>
              <hr />
              <p><strong>Recaudado:</strong> {formatCurrency(ventasMes.totalRecaudado || 0)}</p>
              <p><strong>Pasajeros:</strong> {ventasMes.totalPasajeros || 0}</p>
              <p><strong>Boletos:</strong> {ventasMes.totalBoletos || 0}</p>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card className="shadow">
            <CardBody>
              <CardTitle tag="h5" className="text-info">
                <i className="fas fa-chart-line mr-2"></i>
                Estadísticas Generales
              </CardTitle>
              <hr />
              <p><strong>Total Choferes:</strong> {estadisticas.totalChoferes || 0}</p>
              <p><strong>Total Viajes:</strong> {estadisticas.totalViajes || 0}</p>
              <p><strong>Ruta Popular:</strong> {estadisticas.rutaMasPopular?.ruta || 'N/A'}</p>
              {estadisticas.rutaMasPopular?.count > 0 && (
                <Badge color="success">{estadisticas.rutaMasPopular.count} viajes</Badge>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row>
        {/* Gráfico de barras de ventas del día */}
        <Col md="8">
          <Card className="shadow mb-4">
            <CardBody>
              <CardTitle tag="h5" className="text-primary">
                <i className="fas fa-chart-bar mr-2"></i>
                Ventas por Ruta - Hoy
              </CardTitle>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={ventas.map((venta) => ({
                    name: `${venta.origen} → ${venta.destino}`,
                    Pasajeros: venta.totalPasajeros,
                    Ventas: venta.totalRecaudado,
                  }))}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => 
                    name === 'Ventas' ? [formatCurrency(value), name] : [value, name]
                  } />
                  <Legend />
                  <Bar dataKey="Pasajeros" fill="#4e73df" />
                  <Bar dataKey="Ventas" fill="#1cc88a" />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </Col>

        {/* Gráfico circular de distribución de pasajeros */}
        <Col md="4">
          <Card className="shadow mb-4">
            <CardBody>
              <CardTitle tag="h5" className="text-success">
                <i className="fas fa-chart-pie mr-2"></i>
                Distribución de Pasajeros
              </CardTitle>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={ventas.map((venta, index) => ({
                      name: `${venta.origen} → ${venta.destino}`,
                      value: venta.totalPasajeros,
                      fill: COLORS[index % COLORS.length]
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ventas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Resumen de rendimiento */}
      <Row>
        <Col>
          <Card className="shadow">
            <CardBody>
              <CardTitle tag="h5" className="text-dark">
                <i className="fas fa-info-circle mr-2"></i>
                Resumen de Rendimiento
              </CardTitle>
              <hr />
              <Row>
                <Col md="6">
                  <Alert color="info">
                    <strong>Promedio por viaje hoy:</strong> {totalViajes > 0 ? formatCurrency(totalRecaudado / totalViajes) : formatCurrency(0)}
                  </Alert>
                  <Alert color="success">
                    <strong>Promedio pasajeros por viaje:</strong> {totalViajes > 0 ? (totalPasajeros / totalViajes).toFixed(1) : 0} pasajeros
                  </Alert>
                </Col>
                <Col md="6">
                  <Alert color="warning">
                    <strong>Comparación semanal:</strong> 
                    {ventasSemana.totalRecaudado > totalRecaudado * 7 ? 
                      " Por encima del promedio diario" : 
                      " Por debajo del promedio diario"
                    }
                  </Alert>
                  <Alert color="primary">
                    <strong>Estado del sistema:</strong> {estadisticas.totalBuses > 0 ? "Operativo" : "Sin buses registrados"}
                  </Alert>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
