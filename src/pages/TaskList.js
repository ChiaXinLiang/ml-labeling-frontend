import React, { useRef, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Nav from "./Nav";
import "./TaskList.css";
import { DataGrid } from "@mui/x-data-grid";
import Divider from "@mui/material/Divider";
import { useDropzone } from "react-dropzone";

function ButtonGroup({ id, selectedIds, handleDelete, handleVerify }) {
  const [fileUrl, setFileUrl] = useState([]);
  const [showPhoto, setShowPhoto] = useState(false);
  const [files, setFiles] = useState([]);

  function UploadImg() {
    const [inputUrl, setInputUrl] = useState("");

    const onDrop = useCallback((acceptedFiles) => {
      if (acceptedFiles?.length) {
        const newFiles = acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        );
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ accept: { "image/*": [] }, onDrop });

    const handleImg = () => {
      setShowPhoto(true);
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
          <button type="submit" className="step1-button" onClick={handleButtonClick}>
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
            {files.length > 0 ? (
              files.map((file, index) => (
                <img
                  key={index}
                  src={file.preview}
                  alt="preview"
                  width="100"
                  height="100"
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                    margin: "5px",
                  }}
                />
              ))
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
            </p>
          </div>
        </section>
      </>
    );
  }

  async function Import() {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    fetch(`${process.env.REACT_APP_LAYER2_ENDPOINT}/projects/${id}/import`, {
      method: process.env.REACT_APP_FORBIDDEN_API_POST_METHOD,
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("Data imported successfully");
        setOpen(false);
      })
      .catch((error) => {
        // console.error("Error:", error);
      });
  }

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function Modal({ openModal, closeModal }) {
    const ref = useRef();

    useEffect(() => {
      if (openModal) {
        ref.current?.showModal();
      } else {
        ref.current?.close();
      }
    }, [openModal]);

    return (
      <dialog ref={ref} onCancel={closeModal} className="modalClassName">
        <div style={{ display: "flex" }}>
          <h2 style={{ display: "flex", marginLeft: "5%", flex: "1" }}>匯入資料</h2>
          <div style={{ display: "flex", flex: "1", margin: "20px", gap: "10px", marginLeft: "50%" }}>
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
        <Divider variant="middle" sx={{ backgroundColor: "rgba(122, 122, 120, 1)" }} />
        <UploadImg />
      </dialog>
    );
  }

  function handleExport() {
    fetch(`${process.env.REACT_APP_LAYER2_ENDPOINT}/export-project/${id}`, {
      method: process.env.REACT_APP_FORBIDDEN_API_GET_METHOD,
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `yolo_export_${id}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => {
        // console.error("Error fetching data:", error);
      });
  }


  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "center", marginLeft: "30px", marginTop: "20px" }}>
      <button className="button">操作</button>
      <button className="button">欄位</button>
      <button className="button">篩選器</button>
      <span style={{ fontSize: "14px", color: "gray" }}>順序</span>
      <button className="button">未設定</button>
      <button className="button" onClick={handleVerify}>驗證</button>
      <button className="button" onClick={handleDelete}>
        刪除
      </button>
      <div style={{ display: "flex", marginLeft: "auto", alignItems: "center", gap: "10px" }}>
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
          匯入
        </button>
        <button className="button" onClick={handleExport}>
          匯出
        </button>
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

function TaskTable({ datas, selectedIds, setSelectedIds }) {
  const { id: projectId } = useParams();

  const handleRowClick = (params) => {

    // Get profile in local storage
    const profile = JSON.parse(localStorage.getItem("profile"));
    if (profile) {
      // Set processor to API server
      const url = `${process.env.REACT_APP_LAYER2_ENDPOINT}/accounts/task/processor`;

      fetch(url, {
        method: process.env.REACT_APP_FORBIDDEN_API_POST_METHOD,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task_id: params.row.id.toString(),
          processor: {"annotator":profile.name, "verifier":""}
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(JSON.stringify(data));
        })
        .catch((error) => {
          // console.error("Error:", error);
        });
    }

    const taskId = params.id;
    const url = new URL(`${process.env.REACT_APP_LABEL_STUDIO_HOST}/projects/${projectId}/data`);
    url.searchParams.append('task', taskId);
    
    const trustedDomain = new URL(process.env.REACT_APP_LABEL_STUDIO_HOST).hostname;
    if (url.hostname === trustedDomain) {
      window.location.href = url.toString();
    } else {
      console.error('Untrusted redirect URL:', url.toString());
    }
  };

  const handleSelectionChange = (ids) => {
    setSelectedIds((prevSelectedIds) => {
      const updatedSelectedIds = prevSelectedIds.includes(ids[0])
        ? prevSelectedIds.filter((id) => id !== ids[0])
        : [...prevSelectedIds, ...ids];

      return updatedSelectedIds;
    });
  };

  return (
    <div style={{ height: 500, width: "100%", marginTop: "20px" }}>
      <DataGrid
        rows={datas}
        columns={columns}
        rowHeight={80}
        disableColumnMenu
        disableColumnSelector
        onRowClick={handleRowClick}
        checkboxSelection
        selectionModel={selectedIds}
        onCellClick={(e) => {
          handleSelectionChange([e.id]);
        }}

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
      />
    </div>
  );
}

export default function TaskList({ ProjectData }) {
  const [projectDatas, setProjectData] = useState([]);
  const [datas, setDatas] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    setProjectData(ProjectData.results);
  }, [ProjectData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/tasks/?project=${id}`, {
          headers: {
            'Authorization': `Token ${process.env.REACT_APP_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data.tasks)) {
          const dataWithSrc = await Promise.all(data.tasks.map(async (item) => {
            // Fetch the image
            const imageResponse = await fetch(`${process.env.REACT_APP_LABEL_STUDIO_HOST}${item.data.image}`, {
              headers: {
                'Authorization': `Token ${process.env.REACT_APP_API_TOKEN}`,
                'Content-Type': 'application/json'
              }
            });

            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);

            // Fetch the processor data
            const processorResponse = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/accounts/task/processor/${item.id}`, {
              headers: {
                'Authorization': `Token ${process.env.REACT_APP_API_TOKEN}`,
                'Content-Type': 'application/json'
              }
            });

            const processorData = await processorResponse.json();
            return {
              id: item.id,
              Complete: item.is_labeled ? "是" : "否",
              "Total annotations": item.total_annotations,
              "Canceled annotations": item.cancelled_annotations,
              "Total Predictions": item.total_predictions,
              "Annotated By": processorData.processor.annotator || item.annotators.join(", "),
              "Verified By": processorData.processor.verifier || "",
              file: {
                src: imageUrl,
                alt: "Image",
              },
            };
          }));

          setDatas(dataWithSrc);
        } else {
          setDatas([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  let projectDataById;
  if (Array.isArray(projectDatas)) {
    projectDataById = projectDatas.find((project) => project.id === Number(id));
  }

  const handleDelete = async () => {
    const idsString = JSON.stringify(selectedIds);
    try {
      const url = new URL(`${process.env.REACT_APP_LAYER2_ENDPOINT}/tasks/delete/`);
      url.searchParams.append('ids', idsString);

      const response = await fetch(url.href, {
        method: "DELETE",
        headers: {
          'Authorization': `Token ${process.env.REACT_APP_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert("任務刪除成功");

      // Update the state to remove the deleted tasks from the table
      setDatas((prevDatas) => prevDatas.filter((task) => !selectedIds.includes(task.id)));
      setSelectedIds([]);

    } catch (error) {
      console.error("Error deleting tasks:", error);
      alert("刪除任務時發生錯誤");
    }
  };

  const handleVerify = async () => {
    // Get profile from local storage
    const profile = JSON.parse(localStorage.getItem("profile"));
    if (!profile || !profile.name) {
      console.error("Profile or profile name not found in local storage");
      return;
    }

    for (const taskId of selectedIds) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        task_id: taskId.toString(),
        processor: {
          annotator: "",
          verifier: profile.name,
        },
      });

      const requestOptions = {
        method: process.env.REACT_APP_FORBIDDEN_API_POST_METHOD,
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      try {
        const response = await fetch(`${process.env.REACT_APP_LAYER2_ENDPOINT}/accounts/task/processor`, requestOptions);
        const result = await response.text();
        console.log(result);
        alert("任務驗證成功");
      } catch (error) {
        console.error("Error verifying task:", error);
      }
    }
  };

  return (
    <div>
      <Nav projectDataById={projectDataById} />
      <ButtonGroup id={id} selectedIds={selectedIds} handleDelete={handleDelete} handleVerify={handleVerify} />
      <TaskTable datas={datas} selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
    </div>
  );
}
