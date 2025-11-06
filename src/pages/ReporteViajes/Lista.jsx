import { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import { Button } from "reactstrap";

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <TextField
      id="search"
      type="text"
      placeholder="Filtrar Por Origen/Destino"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
    <ClearButton type="button" onClick={onClear}>
      X
    </ClearButton>
  </>
);

const columns = [
  {
    name: "ID Viaje",
    selector: (row) => row.idViaje,
    sortable: true,
    width: "100px",
  },
  {
    name: "Origen",
    selector: (row) => row.origen,
    sortable: true,
  },
  {
    name: "Destino",
    selector: (row) => row.destino,
    sortable: true,
  },
  {
    name: "Fecha",
    selector: (row) => row.fechaViaje,
    sortable: true,
  },
  {
    name: "Asientos Vendidos",
    selector: (row) => row.asientosVendidos,
    sortable: true,
    width: "150px",
  },
  {
    name: "Boletos",
    selector: (row) => row.cantidadBoletos,
    sortable: true,
    width: "100px",
  },
  {
    name: "Total Ventas",
    selector: (row) => `Bs. ${row.totalVentas.toFixed(2)}`,
    sortable: true,
    width: "150px",
  },
];

const Lista = (props) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const filteredItems = props.items.filter((item) => {
    const searchText = filterText.toLowerCase();
    return (
      (item.origen && item.origen.toLowerCase().includes(searchText)) ||
      (item.destino && item.destino.toLowerCase().includes(searchText))
    );
  });

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };
    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  // Calcular totales
  const totalGeneral = filteredItems.reduce(
    (sum, item) => sum + item.totalVentas,
    0
  );
  const totalAsientos = filteredItems.reduce(
    (sum, item) => sum + item.asientosVendidos,
    0
  );
  const totalBoletos = filteredItems.reduce(
    (sum, item) => sum + item.cantidadBoletos,
    0
  );

  return (
    <>
      <DataTable
        title="Reporte de Viajes"
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        selectableRows
        persistTableHead
      />
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f5f5f5",
          marginTop: "10px",
        }}
      >
        <h5>Resumen</h5>
        <p>
          <strong>Total Viajes:</strong> {filteredItems.length}
        </p>
        <p>
          <strong>Total Asientos Vendidos:</strong> {totalAsientos}
        </p>
        <p>
          <strong>Total Boletos:</strong> {totalBoletos}
        </p>
        <p>
          <strong>Total Ventas:</strong> Bs. {totalGeneral.toFixed(2)}
        </p>
      </div>
    </>
  );
};

export default Lista;
