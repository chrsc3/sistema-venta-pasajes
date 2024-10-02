import { Container, Row, Col } from "reactstrap";
import Ventas from "./Ventas";

const Dashboard = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Welcome to the Dashboard</h1>
          <p>This is the main page of your dashboard.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
