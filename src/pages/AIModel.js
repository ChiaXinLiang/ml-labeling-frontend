import React from "react";
import Nav from "./Nav";
import Form from "react-bootstrap/Form";
import { useState } from "react";
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
  const [open, setOpen] = React.useState(false);
  const [TrainOpen, setTrainOpen] = React.useState(false);
  const [ModelData, setModelData] = React.useState([]);
  const [openDrawerId, setOpenDrawerId] = useState(null);

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

  React.useEffect(() => {
    fetch(
      `${process.env.REACT_APP_ENDPOINT_MODEL_MANAGER}/modelManager/getModelTable`
    )
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
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
                  <span>yyyy/mm/dd</span>
                  <span>21:59:59</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                  }}
                >
                  <button
                    className="setbutton"
                    onClick={() => handleClickOpen(item)}
                  >
                    設定
                  </button>
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
                                    <>
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
                                    </>
                                  ))}
                                <button
                                  className="aibutton"
                                  style={{ height: "30px" }}
                                >
                                  佈署
                                </button>
                              </div>
                              <p className="offcanvas-p">安全帽版本模型列表</p>
                              <div className="offcanvas-box">
                                {item.weights.map((weight, index) => (
                                  <>
                                    <div
                                      key={index}
                                      style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        //gap: "100px",
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
                                  </>
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
