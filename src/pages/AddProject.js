import * as React from "react";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Nav from "./Nav";
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

function Step1() {
  const [fileUrl, setFileUrl] = React.useState([]);
  const [inputUrl, setInputUrl] = React.useState("");
  const [showPhoto, setShowPhoto] = React.useState(false); // New state for controlling the visibility of the Photo component

  const [file, setFile] = React.useState([]);

  function Photo() {
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

    return (
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
    );
  }

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
          id="url"
          name="url"
          placeholder="資料集網址"
          value={inputUrl}
          onChange={handleInputChange}
          style={{
            width: "40%",
            marginLeft: "-280px",
            height: "26px",
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
      {showPhoto && <Photo />}
      {!showPhoto && (
        <div
          style={{
            marginTop: "30px",
            display: "flex",
          }}
        >
          <div style={{ flex: "3" }}>
            {fileUrl.map((url) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "90%",
                  height: "26px",
                  border: "1px solid black",
                  borderRadius: "5px",
                  marginLeft: "5%",
                }}
              >
                <span
                  style={{ display: "flex", marginLeft: "10px", flex: "6" }}
                >
                  {url}
                </span>
                <button className="step1-add-button">加入</button>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flex: "3",
              backgroundColor: "rgba(225, 234, 240, 1)",
              height: "250px",
            }}
          >
            <span style={{ marginBottom: "16px", marginRight: "58%" }}>
              已加入的資料及清單
            </span>
            <div
              style={{
                width: "85%",
                height: "72%",
                border: "1px solid black",
              }}
            ></div>
          </div>
        </div>
      )}
      <Divider
        variant="middle"
        sx={{ backgroundColor: "rgba(122, 122, 120, 1)", marginTop: "30px" }}
      />
    </>
  );
}

function Step2() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
          marginLeft: "2%",
          marginRight: "2%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "115px",
            height: "34px",
            fontSize: "14px",
            backgroundColor: "rgba(217, 217, 217, 0.5)",
            borderRadius: "5px",
            color: "rgba(0, 0, 0, 1)",
          }}
        >
          <span>電腦視覺</span>
          <span>{">"}</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "25%",
          }}
        >
          <label style={{ marginRight: "60%", fontSize: "14px" }}>
            知識本體名稱
          </label>
          <input
            type="text"
            style={{
              height: "26px",
              borderRadius: "5px",
              border: "1px solid black",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "45%" }}>
          <label style={{ marginRight: "90%", fontSize: "14px" }}>說明</label>
          <input
            type="text"
            style={{
              height: "26px",
              borderRadius: "5px",
              border: "1px solid black",
            }}
          />
        </div>
      </div>
      <div className="set-container">
        <div className="set-container-border">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginRight: "10%",
              marginTop: "5px",
              flex: "5",
              gap: "10px",
            }}
          >
            <span style={{ marginRight: "70%" }}>加入物件</span>
            <div
              style={{
                display: "flex",
                height: "30px",
                gap: "20px",
                marginLeft: "15px",
              }}
            >
              <input type="text" />
              <input type="text" />
            </div>
          </div>
          <div
            style={{
              flex: "1",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
              marginRight: "10px",
            }}
          >
            <button
              style={{
                width: "80px",
                height: "30px",
                borderRadius: "10px",
                border: "none",
                color: "rgba(23, 115, 185, 1)",
              }}
            >
              刪除
            </button>
          </div>
        </div>
        <div>
          <button
            style={{
              width: "80px",
              height: "30px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "rgba(23, 115, 185, 1)",
              color: "white",
            }}
          >
            新增
          </button>
        </div>
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

export default function AddProject({ ProjectData }) {
  const [open, setOpen] = React.useState(false);
  const [datas, setData] = React.useState([]);

  React.useEffect(() => {
    setData(ProjectData.results);
  }, [ProjectData]);

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
          marginTop: "5%",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "300px",
          }}
        >
          <h3>標註專案列表</h3>
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
        </div>
        <div
          style={{
            backgroundColor: "rgba(245, 245, 245, 1)",
            width: "70%",
            height: "400px",
          }}
        >
          <div style={{ display: "flex" }}>
            <p style={{ flex: "3" }}>專案名稱</p>
            <p style={{ flex: "1" }}>總任務數量</p>
            <p style={{ flex: "1" }}>已完成任務</p>
            <p style={{ flex: "1" }}>已驗證</p>
            <p style={{ flex: "1" }}>狀態</p>
            <p style={{ flex: "1" }}>日期</p>
            <p style={{ flex: "1" }}>時間</p>
          </div>
          <hr style={{ width: "90%" }} />
          {Array.isArray(datas) &&
            datas.map((data) => (
              <div style={{ display: "flex" }}>
                <p style={{ flex: "3" }}>{data.title}</p>
                <p style={{ flex: "1" }}>{data.task_number}</p>
                <p style={{ flex: "1" }}>{data.finished_task_number}</p>
                <p style={{ flex: "1" }}>{data.ground_truth_number}</p>
                <p style={{ flex: "1" }}>
                  <Chip
                    label={data.is_draft ? "已處理" : "未處理"}
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
            ))}
        </div>
      </div>
    </React.Fragment>
  );
}
