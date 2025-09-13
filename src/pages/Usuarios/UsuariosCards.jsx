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
import userService from "../../services/user";
import rolesService from "../../services/roles";
import { useEffect, useState } from "react";

function UsuariosCards(props) {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    rolesService
      .getAll()
      .then((response) => {
        setRoles(response);
      })
      .catch((error) => {
        console.error("Error al obtener roles:", error);
      });
  }, []);

  const deleteItem = (id, nombre) => {
    let confirmDelete = window.confirm(`¿Está seguro que desea eliminar al usuario ${nombre}?`);
    if (confirmDelete) {
      userService
        .remove(id)
        .then(() => {
          props.deleteItemFromState(id);
        })
        .catch((error) => alert(`Error al eliminar usuario: ${error}`));
    }
  };

  const getRoleName = (rolId) => {
    const rol = roles.find(rol => rol.idRol === rolId);
    return rol ? rol.nombre : 'Sin rol';
  };

  const getRolColor = (rolId) => {
    const rol = roles.find(rol => rol.idRol === rolId);
    if (!rol) return 'secondary';
    
    // Asignar colores según el tipo de rol
    switch (rol.nombre.toLowerCase()) {
      case 'administrador':
      case 'admin':
        return 'danger';
      case 'gerente':
      case 'supervisor':
        return 'warning';
      case 'vendedor':
      case 'cajero':
        return 'info';
      case 'usuario':
      default:
        return 'primary';
    }
  };

  const usuariosCards = props.items.map((usuario) => {
    return (
      <Col md="4" lg="3" key={usuario.idUsuario} className="mb-4">
        <Card className="h-100 shadow-sm usuario-card">
          <CardHeader className="bg-primary text-white text-center">
            <div className="usuario-avatar">
              <i className="fas fa-user fa-2x"></i>
            </div>
          </CardHeader>
          <CardBody className="d-flex flex-column">
            <CardTitle tag="h5" className="text-primary text-center mb-3">
              {usuario.nombre} {usuario.apellido}
            </CardTitle>
            
            <div className="usuario-info flex-grow-1">
              <div className="info-item mb-2">
                <i className="fas fa-id-badge text-muted mr-2"></i>
                <strong>ID:</strong> 
                <Badge color="secondary" className="ml-2">#{usuario.idUsuario}</Badge>
              </div>
              
              <div className="info-item mb-2">
                <i className="fas fa-user-circle text-info mr-2"></i>
                <strong>Usuario:</strong>
                <div className="ml-4">{usuario.user || 'No asignado'}</div>
              </div>
              
              <div className="info-item mb-2">
                <i className="fas fa-phone text-success mr-2"></i>
                <strong>Teléfono:</strong>
                <div className="ml-4">{usuario.telefono || 'No registrado'}</div>
              </div>
              
              <div className="info-item mb-2">
                <i className="fas fa-map-marker-alt text-warning mr-2"></i>
                <strong>Dirección:</strong>
                <div className="ml-4" style={{fontSize: '0.85rem'}}>
                  {usuario.direccion || 'No registrada'}
                </div>
              </div>
              
              <div className="info-item mb-3">
                <i className="fas fa-user-tag text-purple mr-2"></i>
                <strong>Rol:</strong>
                <div className="ml-4">
                  <Badge color={getRolColor(usuario.Roles_idRol)} className="p-2">
                    {getRoleName(usuario.Roles_idRol)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="usuario-actions mt-auto">
              <div className="d-flex justify-content-between">
                <ModalForm
                  buttonLabel="Editar"
                  item={usuario}
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
                  onClick={() => deleteItem(usuario.idUsuario, usuario.nombre)}
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
                <h4 className="text-muted">No hay usuarios registrados</h4>
                <p className="text-muted">Comience agregando un nuevo usuario al sistema</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          {usuariosCards}
        </Row>
      )}
    </div>
  );
}

export default UsuariosCards;
