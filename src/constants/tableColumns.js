export const taskListColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
    headerAlign: "center",
    cellClassName: "super-app-theme--cell",
  },
  {
    field: "Complete",
    headerName: "已完成",
    width: 200,
    sortable: false,
    headerAlign: "center",
    cellClassName: "super-app-theme--cell",
  },
  {
    field: "Total annotations",
    headerName: "總標註數",
    description: "Total annotations per task",
    headerAlign: "center",
    type: "number",
    width: 80,
    cellClassName: "super-app-theme--cell",
  },
  {
    field: "Canceled annotations",
    headerName: "取消的標註數",
    description: "Total Canceled annotations",
    headerAlign: "center",
    type: "number",
    cellClassName: "super-app-theme--cell",
    width: 80,
  },
  {
    field: "Total Predictions",
    headerName: "總預測數",
    description: "Total Predictions per task",
    headerAlign: "center",
    cellClassName: "super-app-theme--cell",
    type: "number",
    width: 80,
  },
  {
    field: "Annotated By",
    headerName: "標註者",
    headerAlign: "center",
    cellClassName: "super-app-theme--cell",
    width: 200,
  },
  {
    field: "Verified By",
    headerName: "驗證者",
    headerAlign: "center",
    cellClassName: "super-app-theme--cell",
    width: 200,
  },
  {
    field: "file",
    headerName: "照片",
    sortable: false,
    renderCell: (params) => {
      return params.value ? (
        <img
          src={params.value.src}
          alt={params.value.alt}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
            borderRadius: "3px",
            cursor: "pointer"
          }}
        />
      ) : null;
    },
    width: 130,
    headerAlign: "center",
  },
];
