import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Step1 from "./Step1";
import Step2 from "./Step2";
import "./AddProject.css";

function Step0({ onUpdateTitle, onUpdateDescription }) {
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");

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
          htmlFor="description"
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
  const steps = ["專案名稱"]; //, "匯入資料", "設定標註"];
  const [activeStep, setActiveStep] = useState(0);
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Knowledge, setKnowledge] = useState(null);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate(); // FIXED

  // const [file, setFile] = useState(null);
  //console.log(file);

  const HandleSubmit = () => {
    const sendFirstRequest = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_LAYER2_ENDPOINT}/projects`,
          {
            title: Title,
            description: Description,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const projectId = response.data.id;

        console.log("Project ID:", projectId);

        const sendSecondRequest = async (id) => {
          try {
            // FIXME: 空知識本體會造成底下的 API 無法運作
            /* const response = await axios.post(
              `${process.env.REACT_APP_API_ENDPOINT}/projects/${id}/knowledge/add`,
              {
                knowledge: Knowledge,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            console.log("Second API Response:", response.data); */

            const formData = new FormData();

            files.forEach((file) => {
              // console.log("File:", file);
              formData.append("files", file);
            });

            // formData.append("files", file);

            const response2 = await axios.post(
              `${process.env.REACT_APP_LAYER2_ENDPOINT}/projects/${id}/import`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            console.log("Third API Response:", response2.data);
          } catch (error) {
            console.error("Error in second request:", error);
            // alert("Error create project. Please try again.");
          }
        };

        sendSecondRequest(projectId);
      } catch (error) {
        console.error("Error in first request:", error);
        // alert("Error create project. Please try again.");
      }
    };

    sendFirstRequest();
    closeModal();
    navigate("/taipower-autolabel-beta"); // FIXED
  };

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
              activestep={activeStep.toString()}
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
              onClick={HandleSubmit}
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
              確定
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
              return <Step1 onFileChange={setFiles} />;
            default:
              return <Step2 onKnowledgeDataChange={setKnowledge} />;
          }
        })()}
      </dialog>
    </React.Fragment>
  );
}

function DeleteModal({ openModal, closeModal, selectedIds, onDelete }) {
  const ref = useRef();

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  const handleDelete = () => {
    selectedIds.forEach((id) => {
      fetch(`${process.env.REACT_APP_LAYER2_ENDPOINT}/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(`Project ${id} deleted successfully:`, data);
          onDelete(id); // 更新UI
        })
        .catch((error) => {
          // console.error(`Error deleting project ${id}:`, error);
        });
    });
    closeModal();
  };

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
            <img src="warn.png" alt="warn" width={30} />
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
              type="button"
              onClick={handleDelete}
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
              確定
            </button>
          </div>
        </div>
      </dialog>
    </React.Fragment>
  );
}

export default function AddProject({ ProjectData }) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [datas, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [role1, setRole1] = useState("");
  const [role2, setRole2] = useState("");

  useEffect(() => {
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

  const handleDeleteProject = (id) => {
    setData((prevData) => prevData.filter((data) => data.id !== id));
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.filter((selectedId) => selectedId !== id)
    );
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const jwtToken = urlParams.get("token");

    if (jwtToken) {
      fetch(`${process.env.REACT_APP_LAYER2_ENDPOINT}/jwt?token=${jwtToken}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Decoded JWT data:", data);
          data = JSON.parse(data);

          if (data.roles) {
            const roles = data.roles;
            const name = data.name;

            if (roles.length > 0) {

              // Set login user's role
              setRole1(roles[0].name);
              setRole2(name);

              // Save to local storage
              localStorage.setItem("profile", JSON.stringify(data));

              // Remove token from URL
              window.history.replaceState({}, document.title, "/");
            }
          }
        })
        .catch((error) => {
          // console.error("Error fetching decoded JWT data:", error);
        });
    }
  }, []);

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
          {/* <h3 style={{ marginRight: "500px" }}>
            標註專案列表 {role1 && role2 && ` ( ${role1} / ${role2} )`}
          </h3> */}

          <h3 style={{ marginRight: "500px" }}>
            標註專案列表{" "}
            {role1 && role2 && (
              <span style={{ color: "blue", marginLeft: "60px" }}>
                {" "}
                ( {role2} / {role1} ){" "}
              </span>
            )}
          </h3>

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
          <DeleteModal
            openModal={deleteOpen}
            closeModal={handleDeleteClose}
            selectedIds={selectedIds}
            onDelete={handleDeleteProject}
          />
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
                key={data.id}
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
                    <p>{data.title}</p>
                  </Link>
                  <p style={{ flex: "1" }}>{data.task_number}</p>
                  <p style={{ flex: "1" }}>{data.num_tasks_with_annotations}</p>
                  <p style={{ flex: "1" }}>{data.ground_truth_number}</p>
                  <div style={{ flex: "1" }}>
                    <Chip
                      label={
                        data.task_number > data.num_tasks_with_annotations
                          ? "未處理"
                          : "已處理"
                      }
                      sx={{
                        backgroundColor: "rgba(255, 165, 99, 1)",
                        color: "white",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                  <p style={{ flex: "1" }}>
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