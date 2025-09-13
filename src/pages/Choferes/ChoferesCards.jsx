/* eslint-disable react/prop-types */
import { 
  Row, 
  Col, 
  Card, 
  CardBody, 
  CardTitle, 
  CardText, 
  Button, 
  Badge,
  CardHeader
} from "reactstrap";
import ModalForm from "./Modal";
import choferService from "../../services/choferes";

function ChoferesCards(props) {
  const deleteItem = (id, nombre) => {
    let confirmDelete = window.confirm(`¿Está seguro que desea eliminar al chofer ${nombre}?`);
    if (confirmDelete) {
      choferService
        .remove(id)
        .then(() => {
          props.deleteItemFromState(id);
        })
        .catch((error) => alert(`Error al eliminar chofer: ${error}`));
    }
  };

  const choferesCards = props.items.map((chofer) => {
    return (
      <Col md="4" lg="3" key={chofer.idChofer} className="mb-4">
        <Card className="h-100 shadow-sm chofer-card">
          <CardHeader className="bg-primary text-white text-center">
            <div className="chofer-avatar">
              <i className="fas fa-user-tie fa-2x"></i>
            </div>
          </CardHeader>
          <CardBody className="d-flex flex-column">
            <CardTitle tag="h5" className="text-primary text-center mb-3">
              {chofer.nombre}
            </CardTitle>
            
            <div className="chofer-info flex-grow-1">
              <div className="info-item mb-2">
                <i className="fas fa-id-badge text-muted mr-2"></i>
                <strong>ID:</strong> 
                <Badge color="secondary" className="ml-2">#{chofer.idChofer}</Badge>
              </div>
              
              <div className="info-item mb-2">
                <i className="fas fa-phone text-success mr-2"></i>
                <strong>Teléfono:</strong>
                <div className="ml-4">{chofer.telefono || 'No registrado'}</div>
              </div>
              
              <div className="info-item mb-3">
                <i className="fas fa-id-card text-warning mr-2"></i>
                <strong>Licencia:</strong>
                <div className="ml-4">
                  <Badge color="info" className="p-2">
                    {chofer.numLicencia || 'No registrada'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="chofer-actions mt-auto">
              <div className="d-flex justify-content-between">
                <ModalForm
                  buttonLabel="Editar"
                  item={chofer}
                  updateState={props.updateState}
                  buttonProps={{
                    color: "primary",
                    size: "sm",
                    className: "flex-fill mr-1"
                  }}
                />
                <Button 
                  color="danger" 
                  size="sm"
                  className="flex-fill ml-1"
                  onClick={() => deleteItem(chofer.idChofer, chofer.nombre)}
                >
                  <i className="fas fa-trash mr-1"></i>
                  Eliminar
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    );
  });

  return (
    <div>
      {props.items.length === 0 ? (
        <Row>
          <Col>
            <Card className="text-center py-5">
              <CardBody>
                <i className="fas fa-users fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">No hay choferes registrados</h4>
                <p className="text-muted">Comience agregando un nuevo chofer al sistema</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          {choferesCards}
        </Row>
      )}
    </div>
  );
}

export default ChoferesCards;
