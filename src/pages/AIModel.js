import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Form from "react-bootstrap/Form";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import "./AIModel.css";

const modelTypeMapping = {
  background: "背景",
  confinedSpaceComponent: "侷限空間配件",
  confinedSpaceDevice: "侷限空間設備",
  equipment: "安全裝束",
  fireSmoke: "異常災害",
  poleComponent: "電線桿配件",
  trafficDevice: "交通設備",
  vehicleComponent: "營建系車輛配件",
  bucketComponent: "挖斗配件",
};

function SettingModal({ openModal, closeModal }) {
  const ref = React.useRef();

  React.useEffect(() => {
    if (ref.current !== null) {
      if (openModal) {
        ref.current.showModal();
      } else {
        ref.current.close();
      }
    }
  }, [openModal]);

  const handleOverlayClick = (event) => {
    if (event.target === ref.current) {
      closeModal();
    }
  };

  return (
    <React.Fragment>
      <dialog
        ref={ref}
        onClick={handleOverlayClick}
        onCancel={closeModal}
        className="settingModal"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginBottom: "20%",
            }}
          >
            <div className="dialog-box">
              <label>設定模型</label>
              <Form.Select
                aria-label="Default select example"
                className="dialog-form"
              >
                <option>選擇模型名稱</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </Form.Select>
            </div>
            <div className="dialog-box">
              <label>訓練資料集</label>
              <Form.Select
                aria-label="Default select example"
                className="dialog-form"
              >
                <option>資料集列表</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </Form.Select>
            </div>
            <div className="dialog-box">
              <label>儲存模型名稱</label>
              <input
                type="text"
                style={{
                  width: "200px",
                  height: "30px",
                  borderRadius: "5px",
                  backgroundColor: "rgba(217, 217, 217, 1)",
                  border: "none",
                }}
              />
            </div>
          </div>
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
            套用
          </button>
        </div>
      </dialog>
    </React.Fragment>
  );
}

export default function AIModel() {
  const [open, setOpen] = useState(false);
  const [TrainOpen, setTrainOpen] = useState(false);
  const [ModelData, setModelData] = useState([]);
  const [openDrawerId, setOpenDrawerId] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [isTraining, setIsTraining] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setTrainOpen(newOpen);
  };

  const handleToggleDrawerId = (item) => {
    setOpenDrawerId(item.model_id);
  };

  const handleTrainClick = (item) => {
    handleToggleDrawerId(item);
    toggleDrawer(true)();
  };

  const handleButtonClick = (index) => {
    setActiveButton(index);
  };

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_ENDPOINT_MODEL_MANAGER}/modelManager/getModelTable`
    )
      .then((res) => res.json())
      .then((data) => {
        setModelData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleClickOpen = (item) => {
    setOpen(true);
    setOpenDrawerId(item.model_id);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenDrawerId(null);
  };

  const handleStartTrainClick = () => {
    // Send Get request to the endpoint
    fetch(`${process.env.REACT_APP_ENDPOINT_TRAINER}/train/trainingStatus`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.state === true) {
          // Start training
          alert("開始訓練");
          setIsTraining(true);

          // Start training
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

          const urlencoded = new URLSearchParams();
          urlencoded.append("weight", "1");
          urlencoded.append("weight_name", "2");
          urlencoded.append("model_id", "3");
          urlencoded.append("train_path", "4");
          urlencoded.append("valid_path", "5");

          const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: urlencoded,
            redirect: "follow"
          };

          fetch(`${process.env.REACT_APP_ENDPOINT_TRAINER}/train/trainingConfig`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
          // END

        } else {
          alert("訓練中，請稍後再試");
          setIsTraining(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    if (isTraining) {
      document.getElementById("startTrain").innerText = "訓練中，請稍後再試";
    }
  }, [isTraining]);

  return (
    <div
      style={{
        backgroundColor: "rgba(217, 217, 217, 0.5)",
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Nav />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "2%",
          width: "80%",
          marginLeft: "10%",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ display: "flex", justifyContent: "start" }}>
          AI 模型列表
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "start",
            alignItems: "center",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {Array.isArray(ModelData.data) &&
            ModelData.data.map((item) => (
              <div
                key={item.model_id}
                style={{
                  backgroundColor: "white",
                  width: "180px",
                  height: "220px",
                  borderRadius: "10px",
                }}
              >
                <p
                  style={{
                    height: "16px",
                    display: "flex",
                    marginLeft: "10%",
                    fontSize: "18px",
                    marginTop: "10px",
                  }}
                >
                  {modelTypeMapping[item.model_type]}
                </p>
                <p
                  style={{ height: "10px", display: "flex", marginLeft: "10%" }}
                >
                  F Score
                </p>
                {item.weights
                  .filter((weight) => weight.weight_state === true)
                  .map((weight, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: "80px",
                        color: "rgba(23, 115, 185, 0.77)",
                        display: "flex",
                        marginLeft: "10%",
                        lineHeight: "80px",
                      }}
                    >
                      {Number(weight.F_score).toFixed(1)}
                    </span>
                  ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "10px",
                    fontSize: "14px",
                    gap: "10px",
                  }}
                >
                  {/* <span>yyyy/mm/dd</span>
                  <span>21:59:59</span> */}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                  }}
                >
                  {/* <button
                    className="setbutton"
                    onClick={() => handleClickOpen(item)}
                  >
                    設定
                  </button> */}
                  <SettingModal openModal={open} closeModal={handleClose} />
                  <div>
                    <button
                      onClick={() => handleTrainClick(item)}
                      className="aibutton"
                    >
                      訓練
                    </button>
                    <Drawer
                      open={TrainOpen}
                      onClose={toggleDrawer(false)}
                      //hideBackdrop={true}
                      anchor="right"
                      ModalProps={{
                        BackdropProps: {
                          style: { backgroundColor: "inherit" },
                        },
                      }}
                      PaperProps={{
                        sx: {
                          backgroundColor: "white",
                          width: "500px",
                        },
                      }}
                    >
                      {Array.isArray(ModelData.data) &&
                        ModelData.data
                          .filter((item) => item.model_id === openDrawerId)
                          .map((item) => (
                            <>
                              <div
                                key={item.model_id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "500px",
                                  marginTop: "40px",
                                }}
                                onClick={toggleDrawer(false)}
                              >
                                {item.weights
                                  .filter(
                                    (weight) => weight.weight_state === true
                                  )
                                  .map((weight) => (
                                    <React.Fragment key={weight.weight_name}>
                                      <div className="offcanvas-text">
                                        <span>目前使用版本</span>
                                        <span>{weight.weight_name}</span>
                                      </div>
                                      <div className="offcanvas-text">
                                        <span>精確率</span>
                                        <span>
                                          {Number(weight.Precision).toFixed(2)}
                                        </span>
                                      </div>
                                      <div className="offcanvas-text">
                                        <span>召回率</span>
                                        <span>
                                          {Number(weight.Recall).toFixed(2)}
                                        </span>
                                      </div>
                                    </React.Fragment>
                                  ))}
                              </div>
                              <h4
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "500px",
                                  marginLeft: "40px",
                                }}
                              >
                                功能:
                              </h4>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "500px",
                                  marginLeft: "40px",
                                }}
                              >
                                <button
                                  id="startTrain"
                                  className="aibutton"
                                  onClick={() => handleStartTrainClick()}
                                  style={{ marginRight: "10px", width: "100px" }}
                                >
                                  訓練與佈署
                                </button>
                                {/* <button className="aibutton">佈署</button> */}
                              </div>

                              <p className="offcanvas-p">安全帽版本模型列表</p>
                              <div className="offcanvas-box">
                                {item.weights.map((weight, index) => (
                                  <React.Fragment key={weight.weight_name}>
                                    <div
                                      style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "50px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          flex: "5",
                                          marginLeft: "20px",
                                        }}
                                      >
                                        {weight.weight_name}
                                      </span>
                                      <button
                                        className="offcanvas-button"
                                        style={{ flex: "1" }}
                                        onClick={() => handleButtonClick(index)}
                                        hidden={activeButton === index}
                                      >
                                        切換
                                      </button>
                                    </div>
                                    <Divider
                                      sx={{
                                        border:
                                          "0.8px solid rgba(189, 188, 183, 1)",
                                        width: "100%",
                                        height: "1px",
                                      }}
                                    />
                                  </React.Fragment>
                                ))}
                              </div>
                            </>
                          ))}
                    </Drawer>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}