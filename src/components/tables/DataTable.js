import React from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function DataTable({
  rows,
  columns,
  onCellClick,
  selectedIds,
  onSelectionChange,
  rowHeight = 80,
  pageSize = 100,
  checkboxSelection = true,
  disableColumnMenu = true,
  disableColumnSelector = true,
  onRowClick,
  ...props
}) {
  return (
    <div style={{ height: 500, width: "100%", marginTop: "20px" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowHeight={rowHeight}
        disableColumnMenu={disableColumnMenu}
        disableColumnSelector={disableColumnSelector}
        onCellClick={onCellClick}
        onRowClick={onRowClick}
        checkboxSelection={checkboxSelection}
        rowSelectionModel={selectedIds}
        onRowSelectionModelChange={onSelectionChange}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize },
          },
        }}
        sx={{
          ".MuiDataGrid-columnSeparator--resizing": {
            display: "block",
          },
          "&.MuiDataGrid-root": {
            border: "1px solid #e0e0e0",
          },
          "& .super-app-theme--cell": {
            textAlign: "center",
          },
        }}
        {...props}
      />
    </div>
  );
}
