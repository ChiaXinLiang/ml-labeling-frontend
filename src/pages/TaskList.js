import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import Nav from "./Nav";
import "./TaskList.css";
import { DataGrid } from "@mui/x-data-grid";
import Divider from "@mui/material/Divider";
import { useDropzone } from "react-dropzone";

function ButtonGroup({ id }) {
  const [fileUrl, setFileUrl] = React.useState([]);
  const [showPhoto, setShowPhoto] = React.useState(false); // New state for controlling the visibility of the Photo component
  const [file, setFile] = React.useState([]);
  //console.log(file);

  function UploadImg() {
    const [inputUrl, setInputUrl] = React.useState("");

    const onDrop = React.useCallback((acceptedFiles) => {
      if (acceptedFiles?.length) {
        const file = acceptedFiles[0];
        setFile(Object.assign(file, { preview: URL.createObjectURL(file) }));
      }
    }, []);

    const {
      getRootProps,
      getInputProps,
      // isFocused,
      // isDragAccept,
      // isDragReject,
    } = useDropzone({ accept: { "image/*": [] }, onDrop });

    const handleImg = () => {
      setShowPhoto(true); // Show the Photo component when the button is clicked
    };

    const handleInputChange = (e) => {
      setInputUrl(e.target.value);
    };

    const handleButtonClick = () => {
      setFileUrl([...fileUrl, inputUrl]);
    };

    return (
      <>
        <div style={{ marginTop: "20px" }}>
          <input
            type="url"
            name="url"
            placeholder="資料集網址"
            value={inputUrl}
            onChange={handleInputChange}
            style={{
              width: "40%",
              marginLeft: "-280px",
              height: "30px",
              borderRadius: "5px",
              border: "black solid 1px",
            }}
          />
          <button
            type="submit"
            className="step1-button"
            onClick={handleButtonClick}
          >
            新增網址
          </button>
          <span>或</span>
          <button className="step1-button" onClick={handleImg}>
            上傳檔案
          </button>
        </div>
        <section className="filecontainer">
          <div {...getRootProps({ className: "dropzone" })}>
            <p>瀏覽或將檔案拖曳至此</p>
            <input {...getInputProps()} />
            {file && file.preview ? (
              <img
                src={file.preview}
                alt="preview"
                width="100"
                height="100"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <img
                src="/upload.png"
                alt="upload"
                width="50"
                height="50"
                style={{
                  objectFit: "contain",
                }}
              />
            )}
            <p style={{ fontSize: "12px" }}>
              Images : jpg, jpeg, png, gif, bmp, svg, webp
            </p>
            <p style={{ marginTop: "38%", fontSize: "12px" }}>
              * 支援取決於瀏覽器
              <br />* 想匯入更大的檔案，請使用雲端硬碟
            </p>
          </div>
        </section>
      </>
    );
  }

  async function Import() {
    const formData = new FormData();
    formData.append("files", file);

    fetch(`${process.env.REACT_APP_LAYER2_ENDPOINT}/projects/${id}/import`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("Data imported successfully");
        setOpen(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function Modal({ openModal, closeModal }) {
    const ref = useRef();

    React.useEffect(() => {
      if (openModal) {
        ref.current?.showModal();
      } else {
        ref.current?.close();
      }
    }, [openModal]);

    return (
      <dialog ref={ref} onCancel={closeModal} className="modalClassName">
        <div
          style={{
            display: "flex",
          }}
        >
          <h2
            style={{
              display: "flex",
              marginLeft: "5%",
              flex: "1",
            }}
          >
            匯入資料
          </h2>
          <div
            style={{
              display: "flex",
              flex: "1",
              margin: "20px",
              gap: "10px",
              marginLeft: "50%",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                height: "30px",
                borderRadius: "10px",
                backgroundColor: "white",
                color: "red",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                border: "none",
                width: "80px",
                cursor: "pointer",
              }}
            >
              取消
            </button>
            <button
              type="submit"
              onClick={Import}
              style={{
                height: "30px",
                borderRadius: "10px",
                backgroundColor: "rgba(23, 115, 185, 1)",
                color: "white",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                border: "none",
                width: "80px",
                cursor: "pointer",
              }}
            >
              匯入
            </button>
          </div>
        </div>
        <Divider
          variant="middle"
          sx={{ backgroundColor: "rgba(122, 122, 120, 1)" }}
        />
        <UploadImg />
      </dialog>
    );
  }

  function handleExport() {
    fetch(`${process.env.REACT_APP_LAYER2_ENDPOINT}/export-project/${id}`, {
      method: "GET",
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `yolo_export_${id}.zip`;
        document.body.appendChild(a); // Append the anchor element to the DOM
        a.click(); // Programmatically click the anchor element to start the download
        a.remove();
        //alert("Data exported successfully");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        alignItems: "center",
        marginLeft: "30px",
        marginTop: "20px",
      }}
    >
      <button className="button">actions</button>
      <button className="button">columns</button>
      <button className="button">Filters</button>
      <span style={{ fontSize: "14px", color: "gray" }}>Order</span>
      <button className="button">not set</button>
      <button className="button">Label All Tasks</button>
      <div
        style={{
          display: "flex",
          marginLeft: "auto",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "5px",
            backgroundColor: "#09f",
            border: "none",
          }}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "20px", height: "20px" }}
          >
            <path
              d="M5.85708 4.35708L4 2.5L3 8.5L9 7.5L7.29451 5.79451C8.07439 5.29174 9.00314 5 10 5V3C8.4497 3 7.01708 3.504 5.85708 4.35708Z"
              fill="currentColor"
            ></path>
            <path
              d="M5.52692 12.2366C6.34781 13.8751 8.04256 15 10 15V17C7.25957 17 4.88691 15.4252 3.73767 13.1312L5.52692 12.2366Z"
              fill="currentColor"
            ></path>
            <path
              d="M14.1429 15.6429L16 17.5L17 11.5L11 12.5L12.7055 14.2055C11.9256 14.7083 10.9969 15 10 15V17C11.5504 17 12.9829 16.496 14.1429 15.6429Z"
              fill="currentColor"
            ></path>
            <path
              d="M14.4731 7.76344C13.6522 6.12486 11.9575 5 10 5V3C12.7405 3 15.1131 4.5748 16.2623 6.86882L14.4731 7.76344Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
        <button className="button" onClick={handleOpen}>
          Import
        </button>
        <button className="button" onClick={handleExport}>
          Export
        </button>
        {/* <div
          className="dm-radio-group dm-radio-group_size_medium"
          style={{ minWidth: "110px", justifyContent: "space-between" }}
        >
          <div className="dm-radio-group__buttons">
            <label className="dm-radio-group__button dm-radio-group__button_checked">
              <input
                type="radio"
                className="dm-radio-group__input"
                value="list"
                checked={selectedValue === "list"}
                onChange={(e) => {
                  console.log("Radio button clicked", e.target.value);
                  setSelectedValue(e.target.value);
                }}
              />
              <span>List</span>
            </label>
            <label className="dm-radio-group__button">
              <input
                type="radio"
                className="dm-radio-group__input"
                value="grid"
                checked={selectedValue === "grid"}
                onChange={(e) => setSelectedValue(e.target.value)}
              />
              <span>Grid</span>
            </label>
          </div>
        </div> */}
        <Modal openModal={open} closeModal={handleClose}></Modal>
      </div>
    </div>
  );
}

const columns = [
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
    headerName: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: "rgb(0, 153, 255)" }}
      >
        <rect
          width="20"
          height="20"
          rx="4"
          fill="currentColor"
          fill-opacity="0.2"
        ></rect>
        <rect
          x="5"
          y="5"
          width="10"
          height="10"
          fill="currentColor"
          fill-opacity="0.3"
        ></rect>
        <rect
          x="6"
          y="6"
          width="8"
          height="8"
          stroke="currentColor"
          stroke-opacity="0.3"
          stroke-width="2"
        ></rect>
        <rect
          x="12"
          y="12"
          width="4"
          height="4"
          rx="2"
          fill="currentColor"
        ></rect>
        <rect
          x="4"
          y="12"
          width="4"
          height="4"
          rx="2"
          fill="currentColor"
        ></rect>
        <rect
          x="12"
          y="4"
          width="4"
          height="4"
          rx="2"
          fill="currentColor"
        ></rect>
        <rect
          x="4"
          y="4"
          width="4"
          height="4"
          rx="2"
          fill="currentColor"
        ></rect>
      </svg>
    ),
    description: "Total annotations per task",
    headerAlign: "center",
    type: "number",
    width: 80,
    cellClassName: "super-app-theme--cell",
  },
  {
    field: "Canceled annotations",
    headerName: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: "rgb(221, 0, 0)" }}
      >
        <rect
          width="20"
          height="20"
          rx="4"
          fill="currentColor"
          fill-opacity="0.18"
        ></rect>
        <mask
          id="mask0"
          mask-type="alpha"
          maskUnits="userSpaceOnUse"
          x="3"
          y="3"
          width="14"
          height="14"
        >
          <rect
            x="3.5"
            y="3.5"
            width="13"
            height="13"
            rx="6.5"
            fill="#fff"
          ></rect>
        </mask>
        <g mask="url(#mask0)">
          <rect
            x="3.5"
            y="3.5"
            width="13"
            height="13"
            rx="6.5"
            fill="currentColor"
            fill-opacity="0.3"
          ></rect>
          <rect
            x="4.5"
            y="4.5"
            width="11"
            height="11"
            rx="5.5"
            stroke="currentColor"
            stroke-opacity="0.3"
            stroke-width="2"
          ></rect>
          <path d="M5 5L15 15" stroke="currentColor" stroke-width="2"></path>
        </g>
      </svg>
    ),
    description: "Total Canceled annotations",
    headerAlign: "center",
    type: "number",
    cellClassName: "super-app-theme--cell",
    width: 80,
  },
  {
    field: "Total Predictions",
    headerName: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: "rgb(148, 75, 255)" }}
      >
        <rect
          width="20"
          height="20"
          rx="4"
          fill="currentColor"
          opacity="0.18"
        ></rect>
        <path
          d="M12.3478 9.26087C12.4708 8.64585 12.5323 8.33834 12.6022 8.24657C12.8023 7.98382 13.1977 7.98382 13.3978 8.24657C13.4677 8.33834 13.5292 8.64585 13.6522 9.26087C13.7352 9.67598 13.7767 9.88354 13.851 10.0636C14.0541 10.5553 14.4447 10.9459 14.9364 11.149C15.1165 11.2233 15.324 11.2648 15.7391 11.3478C16.3541 11.4708 16.6617 11.5323 16.7534 11.6022C17.0162 11.8023 17.0162 12.1977 16.7534 12.3978C16.6617 12.4677 16.3541 12.5292 15.7391 12.6522C15.324 12.7352 15.1165 12.7767 14.9364 12.851C14.4447 13.0541 14.0541 13.4447 13.851 13.9364C13.7767 14.1165 13.7352 14.324 13.6522 14.7391C13.5292 15.3541 13.4677 15.6617 13.3978 15.7534C13.1977 16.0162 12.8023 16.0162 12.6022 15.7534C12.5323 15.6617 12.4708 15.3541 12.3478 14.7391C12.2648 14.324 12.2233 14.1165 12.149 13.9364C11.9459 13.4447 11.5553 13.0541 11.0636 12.851C10.8835 12.7767 10.676 12.7352 10.2609 12.6522C9.64585 12.5292 9.33834 12.4677 9.24657 12.3978C8.98382 12.1977 8.98382 11.8023 9.24657 11.6022C9.33834 11.5323 9.64585 11.4708 10.2609 11.3478C10.676 11.2648 10.8835 11.2233 11.0636 11.149C11.5553 10.9459 11.9459 10.5553 12.149 10.0636C12.2233 9.88354 12.2648 9.67598 12.3478 9.26087Z"
          fill="currentColor"
        ></path>
        <path
          d="M6.34783 5.26087C6.47083 4.64585 6.53233 4.33834 6.60222 4.24657C6.80232 3.98382 7.19768 3.98382 7.39778 4.24657C7.46767 4.33834 7.52917 4.64585 7.65217 5.26087C7.7352 5.67598 7.77671 5.88354 7.85103 6.06355C8.05406 6.55533 8.44467 6.94594 8.93645 7.14897C9.11646 7.22329 9.32402 7.2648 9.73913 7.34783C10.3541 7.47083 10.6617 7.53233 10.7534 7.60222C11.0162 7.80232 11.0162 8.19768 10.7534 8.39778C10.6617 8.46767 10.3541 8.52917 9.73913 8.65217C9.32402 8.7352 9.11646 8.77671 8.93645 8.85103C8.44467 9.05406 8.05406 9.44467 7.85103 9.93645C7.77671 10.1165 7.7352 10.324 7.65217 10.7391C7.52917 11.3541 7.46767 11.6617 7.39778 11.7534C7.19768 12.0162 6.80232 12.0162 6.60222 11.7534C6.53233 11.6617 6.47083 11.3541 6.34783 10.7391C6.2648 10.324 6.22329 10.1165 6.14897 9.93645C5.94594 9.44467 5.55533 9.05406 5.06355 8.85103C4.88354 8.77671 4.67598 8.7352 4.26087 8.65217C3.64585 8.52917 3.33834 8.46767 3.24657 8.39778C2.98382 8.19768 2.98382 7.80232 3.24657 7.60222C3.33834 7.53233 3.64585 7.47083 4.26087 7.34783C4.67598 7.2648 4.88354 7.22329 5.06355 7.14897C5.55533 6.94594 5.94594 6.55533 6.14897 6.06355C6.22329 5.88354 6.2648 5.67598 6.34783 5.26087Z"
          fill="currentColor"
        ></path>
      </svg>
    ),
    description: "Total Predictions per task",
    headerAlign: "center",
    cellClassName: "super-app-theme--cell",
    type: "number",
    width: 80,
    //valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
  {
    field: "Annotated By",
    headerName: "標註者",
    headerAlign: "center",
    cellClassName: "super-app-theme--cell",
    width: 200,
  },
  {
    field: "file",
    headerName: "照片",
    sortable: false,
    renderCell: (params) =>
      params.value ? (
        <img
          src={params.value.src}
          alt={params.value.alt}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
            borderRadius: "3px",
          }}
        />
      ) : null,
    width: 130,
    headerAlign: "center",
  },
];

const rows = [
  {
    id: 1,
    Complete: "Apr 09 2024, 10:30:45",
    "Total annotations": 0,
    "Canceled annotations": 35,
    "Total Predictions": 0,
    "Annotated By": "Jon",
    Image: {
      src: "upload/87/afe3d189-sample_640.png",
      alt: "Data",
    },
  },
  {
    id: 2,
    lastName: "Lannister",
    firstName: "Cersei",
    age: 42,
    Image: {
      src: "/upload.png",
      alt: "Data",
    },
  },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  { id: 10, lastName: "Roxie", firstName: "Harvey", age: 65 },
  { id: 11, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

function TaskTable({ datas }) {
  return (
    <div style={{ height: 500, width: "100%", marginTop: "20px" }}>
      <DataGrid
        rows={datas}
        columns={columns}
        rowHeight={80}
        disableColumnMenu
        disableColumnSelector
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 100 },
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
        checkboxSelection
      />
    </div>
  );
}

export default function TaskList({ ProjectData }) {
  const [projectDatas, setProjectData] = React.useState([]);
  const [datas, setDatas] = React.useState([]);
  console.log(datas);
  const { id } = useParams();

  React.useEffect(() => {
    setProjectData(ProjectData.results);
  }, [ProjectData]);

  React.useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/projects/${id}/file-uploads?all=true`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const dataWithSrc = data.map((item) => ({
          ...item,
          src: `upload/${item.id}/${item.imageName}`, // Replace 'imageName' with the actual property name
        }));
        setDatas(dataWithSrc);
        console.log(dataWithSrc);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id]);

  let projectDataById;
  if (Array.isArray(projectDatas)) {
    projectDataById = projectDatas.find((project) => project.id === Number(id));
  }

  return (
    <div>
      <Nav projectDataById={projectDataById} />
      <ButtonGroup id={id} />
      <TaskTable datas={datas} />
    </div>
  );
}
