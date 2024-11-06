import React, { useState, useEffect } from "react";
import axios from "axios";
import Chip from "@mui/material/Chip";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Step1 from "./Step1";
import Step2 from "./Step2";
import "./AddProject.css";
import BaseModal from "../components/modals/BaseModal";
import DeleteModal from "../components/modals/DeleteModal";
import ProjectForm from "../components/forms/ProjectForm";
import ActionButton from "../components/buttons/ActionButton";

function ProjectModal({ openModal, closeModal, onSubmitSuccess }) {
  const steps = ["專案名稱"]; //, "匯入資料", "設定標註"];
  const [activeStep, setActiveStep] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [knowledge, setKnowledge] = useState(null);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      // First request - Create project
      const response = await axios.post(
        `${process.env.REACT_APP_LAYER2_ENDPOINT}/projects`,
        {
          title: title,
          description: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const projectId = response.data.id;

      // Second request - Upload files
      console.log(files)
      if (files && files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });

        try {
          const response2 = await axios.post(
            `${process.env.REACT_APP_LAYER2_ENDPOINT}/projects/${projectId}/import`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("File upload response:", response2.data);
        } catch (error) {
          console.error("Error uploading files:", error);
          throw error;
        }
      }

      // Call onSubmitSuccess to trigger parent component refresh
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

      closeModal();
      navigate("/taipower-autolabel");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("Error creating project. Please try again.");
    }
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleFileChange = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  return (
    <BaseModal
      openModal={openModal}
      closeModal={closeModal}
      title="新增專案"
      onSubmit={handleSubmit}
      submitText="確定"
      cancelText="取消"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flex: "4",
          backgroundColor: "rgba(213, 213, 210, 0.8)",
          height: "60px",
          borderRadius: "10px",
          marginBottom: "20px",
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
                  activeStep === index ? "white" : "rgba(213, 213, 210, 0.1)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {(() => {
        switch (activeStep) {
          case 0:
            return (
              <ProjectForm
                onUpdateTitle={setTitle}
                onUpdateDescription={setDescription}
              />
            );
          case 1:
            return <Step1 onFileChange={handleFileChange} />;
          default:
            return <Step2 onKnowledgeDataChange={setKnowledge} />;
        }
      })()}
    </BaseModal>
  );
}

export default function AddProject({ ProjectData, onSubmitSuccess }) {
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

  const deleteProject = async (projectId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_LAYER2_ENDPOINT}/projects/${projectId}`
      );
      return true;
    } catch (error) {
      console.error(`Error deleting project ${projectId}:`, error);
      return false;
    }
  };

  const handleDeleteProject = async () => {
    if (selectedIds.length === 0) {
      alert("請選擇要刪除的專案");
      return;
    }

    const deleteResults = await Promise.all(
      selectedIds.map((id) => deleteProject(id))
    );

    const allSuccessful = deleteResults.every((result) => result === true);

    if (allSuccessful) {
      setData((prevData) =>
        prevData.filter((data) => !selectedIds.includes(data.id))
      );
      setSelectedIds([]);
      setDeleteOpen(false);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } else {
      alert("刪除專案時發生錯誤，請重試。");
    }
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
              setRole1(roles[0].name);
              setRole2(name);
              localStorage.setItem("profile", JSON.stringify(data));
              window.history.replaceState({}, document.title, "/");
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching decoded JWT data:", error);
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
          <h3 style={{ marginRight: "500px" }}>
            標註專案列表{" "}
            {role1 && role2 && (
              <span style={{ color: "blue", marginLeft: "60px" }}>
                {" "}
                ( {role2} / {role1} ){" "}
              </span>
            )}
          </h3>

          <ActionButton onClick={() => setOpen(true)}>新增專案</ActionButton>
          <ProjectModal 
            openModal={open} 
            closeModal={() => setOpen(false)} 
            onSubmitSuccess={onSubmitSuccess}
          />
          <ActionButton onClick={() => setDeleteOpen(true)}>刪除專案</ActionButton>
          <DeleteModal
            openModal={deleteOpen}
            closeModal={() => setDeleteOpen(false)}
            selectedIds={selectedIds}
            onDelete={handleDeleteProject}
            type="專案"
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
