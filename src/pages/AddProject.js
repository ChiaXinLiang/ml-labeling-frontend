import * as React from "react";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { useEffect, useRef } from "react";
//import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import Step1 from "./Step1";
import Step2 from "./Step2";
import "./AddProject.css";

function Step0({ onUpdateTitle, onUpdateDescription }) {
  const [Title, setTitle] = React.useState("");
  const [Description, setDescription] = React.useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "30px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <label
          htmlFor="name"
          style={{ marginLeft: "-50%", marginBottom: "5px" }}
        >
          專案名稱
        </label>
        <input
          required
          id="name"
          name="name"
          type="text"
          value={Title}
          onChange={(e) => {
            setTitle(e.target.value);
            onUpdateTitle(e.target.value);
          }}
          style={{
            width: "62%",
            borderRadius: "10px",
            border: "black solid 1px",
            lineHeight: "38px",
            fontSize: "18px",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "30px",
        }}
      >
        <label
          htmlFor="name"
          style={{ marginLeft: "-50%", marginBottom: "5px" }}
        >
          專案描述
        </label>
        <textarea
          id="description"
          name="description"
          value={Description}
          onChange={(e) => {
            setDescription(e.target.value);
            onUpdateDescription(e.target.value);
          }}
          rows="6"
          cols="10"
          style={{
            fontSize: "16px",
            height: "80px",
            width: "62%",
            borderRadius: "10px",
            border: "black solid 1px",
          }}
        />
      </div>
    </div>
  );
}

function Modal({ openModal, closeModal }) {
  const ref = useRef();
  const steps = ["專案名稱", "匯入資料", "設定標註"];
  const [activeStep, setActiveStep] = React.useState(0);
  const [Title, setTitle] = React.useState("");
  const [Description, setDescription] = React.useState("");

  async function handleSubmit(e) {
    fetch(`${process.env.REACT_APP_LAYER2_ENDPOINT}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: Title, description: Description }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
    e.preventDefault();
    const data = {
      title: Title,
      description: Description,
    };
    console.log(data);
    closeModal();
  }

  const handleTitleChange = (Title) => {
    setTitle(Title);
  };

  const handleDesChange = (Description) => {
    setDescription(Description);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <React.Fragment>
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
            新增專案
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flex: "4",
              backgroundColor: "rgba(213, 213, 210, 0.8)",
              height: "60px",
              borderRadius: "10px",
            }}
          >
            <div
              activeStep={activeStep}
              style={{
                display: "flex",
                gap: "50px",
              }}
            >
              {steps.map((label, index) => (
                <button
                  key={label}
                  onClick={handleStep(index)}
                  style={{
                    height: "36px",
                    borderRadius: "10px",
                    border: "none",
                    width: "100px",
                    cursor: "pointer",
                    backgroundColor:
                      activeStep === index
                        ? "white"
                        : "rgba(213, 213, 210, 0.1)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div
            style={{ display: "flex", flex: "1", margin: "20px", gap: "10px" }}
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
              刪除
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
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
              儲存
            </button>
          </div>
        </div>
        <Divider
          variant="middle"
          sx={{ backgroundColor: "rgba(122, 122, 120, 1)" }}
        />
        {(() => {
          switch (activeStep) {
            case 0:
              return (
                <Step0
                  onUpdateTitle={handleTitleChange}
                  onUpdateDescription={handleDesChange}
                />
              );
            case 1:
              return <Step1 />;
            default:
              return <Step2 />;
          }
        })()}
      </dialog>
    </React.Fragment>
  );
}

function DeleteModal({ openModal, closeModal }) {
  const ref = React.useRef();

  React.useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <React.Fragment>
      <dialog ref={ref} onCancel={closeModal} className="deleteModal">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <p
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <img src="warn.png" alt="warn" width={30}></img>
            確定刪除所選之專案嗎?
          </p>
          <div
            style={{
              display: "flex",
              flex: "1",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                height: "30px",
                borderRadius: "10px",
                backgroundColor: "rgba(213, 213, 210, 0.8)",
                color: "black",
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
              //onClick={handleSubmit}
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
              儲存
            </button>
          </div>
        </div>
      </dialog>
    </React.Fragment>
  );
}

export default function AddProject({ ProjectData }) {
  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [datas, setData] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState(null);
  const [selectedIds, setSelectedIds] = React.useState([]);

  React.useEffect(() => {
    setData(ProjectData.results);
  }, [ProjectData]);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  const handleClickDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      <Nav />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "2%",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <h3 style={{ marginRight: "500px" }}>標註專案列表</h3>
          <button
            style={{
              height: "30px",
              marginTop: "20px",
              borderRadius: "10px",
              backgroundColor: "rgba(23, 115, 185, 1)",
              color: "white",
              border: "none",
              width: "100px",
              cursor: "pointer",
            }}
            onClick={handleClickOpen}
          >
            新增專案
          </button>
          <Modal openModal={open} closeModal={handleClose} />
          <button
            style={{
              height: "30px",
              marginTop: "20px",
              borderRadius: "10px",
              backgroundColor: "rgba(23, 115, 185, 1)",
              color: "white",
              border: "none",
              width: "100px",
              cursor: "pointer",
            }}
            onClick={handleClickDeleteOpen}
          >
            刪除專案
          </button>
          <DeleteModal openModal={deleteOpen} closeModal={handleDeleteClose} />
        </div>
        <div
          style={{
            backgroundColor: "rgba(245, 245, 245, 1)",
            width: "78%",
            height: "400px",
            overflowY: "scroll",
            overflowX: "hidden",
            marginTop: "20px",
          }}
        >
          <div style={{ display: "flex" }}>
            <input
              type="checkbox"
              style={{ flex: "1", transform: "scale(0.4)" }}
            />
            <p style={{ flex: "3" }}>專案名稱</p>
            <p style={{ flex: "1" }}>總任務數量</p>
            <p style={{ flex: "1" }}>已完成任務</p>
            <p style={{ flex: "1" }}>已驗證</p>
            <p style={{ flex: "1" }}>狀態</p>
            <p style={{ flex: "1" }}>日期</p>
            <p style={{ flex: "1" }}>時間</p>
          </div>
          <hr style={{ width: "95%" }} />
          {Array.isArray(datas) &&
            datas.map((data) => (
              <div
                style={{
                  borderRadius: "5px",
                  backgroundColor: data.id === selectedId ? "white" : "inherit",
                }}
                onMouseEnter={() => setSelectedId(data.id)}
                onMouseLeave={() => setSelectedId(null)}
              >
                <div style={{ display: "flex" }}>
                  <input
                    type="checkbox"
                    style={{ flex: "1", transform: "scale(0.3)" }}
                    checked={selectedIds.includes(data.id)}
                    onChange={() => handleCheckboxChange(data.id)}
                  />
                  <Link
                    to={`/project/${data.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      flex: "3",
                    }}
                  >
                    {" "}
                    <p>{data.title}</p>
                  </Link>
                  <p style={{ flex: "1" }}>{data.task_number}</p>
                  <p style={{ flex: "1" }}>{data.num_tasks_with_annotations}</p>
                  <p style={{ flex: "1" }}>{data.ground_truth_number}</p>
                  <p style={{ flex: "1" }}>
                    <Chip
                      label={
                        data.task_number > data.num_tasks_with_annotations
                          ? "未處理"
                          : "已處理"
                      }
                      sx={{
                        backgroundColor: "rgba(255, 165, 99, 1)",
                        color: "white",
                        marginTop: "-5px",
                      }}
                    />
                  </p>
                  <p style={{ flex: "1" }}>
                    {" "}
                    {new Date(data.created_at).toLocaleDateString()}
                  </p>
                  <p style={{ flex: "1" }}>
                    {new Date(data.created_at).toLocaleTimeString([], {
                      hour12: false,
                    })}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </React.Fragment>
  );
}
