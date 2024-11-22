import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
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
  Rectangle,
} from "recharts";
import Logo from "../../assets/LogoChaque.jpg";
import { useEffect, useState } from "react";
import dashboardService from "../../services/dashboard";
const Dashboard = () => {
  const [ventas, setVentas] = useState([]);
  const [totalRecaudado, setTotalRecaudado] = useState(0);
  const [totalPasajeros, setTotalPasajeros] = useState(0);
  const [totalViajes, setTotalViajes] = useState(0);

  const getItems = () => {
    dashboardService
      .getDay()
      .then((response) => {
        setVentas(response);
      })
      .catch((error) => {
        alert("Error al obtener Ventas", error);
      });
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
    getItems();
  }, []);
  return (
    <Container>
      <Row>
        <Col md="3">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Pasajeros Del Dia</CardTitle>
              <CardText> {totalPasajeros} </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Total Ventas del Dia</CardTitle>
              <CardText> {totalRecaudado} </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Viajes Activos</CardTitle>
              <CardText> {totalViajes} </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md="12">
          <Card>
            <CardBody>
              <ResponsiveContainer
                width="70%"
                height={500}
                style={{ margin: "0 auto", flexWrap: "wrap" }}
              >
                <BarChart
                  data={ventas.map((venta) => ({
                    name: `${venta.origen} a ${venta.destino}`,
                    Pasajeros: venta.totalPasajeros,
                    Ventas: venta.totalRecaudado,
                  }))}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Pasajeros" fill="#8884d8" />
                  <Bar dataKey="Ventas" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
