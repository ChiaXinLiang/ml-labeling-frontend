import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Form from "react-bootstrap/Form";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import "./AIModel.css";
import ModelCard from "../components/cards/ModelCard";
import BaseModal from "../components/modals/BaseModal";
import { datasetMapping, modelTypeMapping } from "../constants/modelMappings";

function SettingModal({ openModal, closeModal }) {
  return (
    <BaseModal
      openModal={openModal}
      closeModal={closeModal}
      title="設定模型"
      submitText="套用"
      className="settingModal"
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
          </Form.Select>
        </div>
        <div className="dialog-box">
          <label>訓練資料集</label>
          <Form.Select
            aria-label="Default select example"
            className="dialog-form"
          >
            <option>資料集列表</option>
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
    </BaseModal>
  );
}

function HelloModal({ openHelloModal, closeHelloModal, onConfirm, selectedModelType }) {
  const [modelOptions, setModelOptions] = useState([]);
  const [datasetOptions, setDatasetOptions] = useState([]);
  const [weightName, setWeightName] = useState("tpc_test_v1");

  useEffect(() => {
    // Fetch model options
    fetch(
      `${process.env.REACT_APP_ENDPOINT_MODEL_MANAGER}/modelManager/getModelTable`
    )
      .then((response) => response.json())
      .then((result) => {
        const options = result.data
          .filter((model) => model.model_type === selectedModelType)
          .flatMap((model) =>
            model.weights.map((weight) => ({
              modelType: model.model_type,
              weightName: weight.weight_name,
            }))
          );
        setModelOptions(options);
      })
      .catch((error) => console.error(error));

    // Fetch dataset options
    fetch(`${process.env.REACT_APP_LAYER2_ENDPOINT}/projects`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.REACT_APP_API_TOKEN}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        const options = result.results.map((project) => project.title);
        setDatasetOptions(options);
      })
      .catch((error) => console.error(error));
  }, [selectedModelType]);

  return (
    <BaseModal
      openModal={openHelloModal}
      closeModal={closeHelloModal}
      title="訓練設定"
      onSubmit={() => onConfirm(weightName)}
      className="helloModal"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <div className="dialog-box">
          <label>基礎訓練模型</label>
          <Form.Select
            aria-label="Default select example"
            className="dialog-form"
          >
            {modelOptions.map((option, index) => (
              <option key={index} value={option.weightName}>
                {option.weightName}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="dialog-box">
          <label>選擇訓練集</label>
          <Form.Select
            aria-label="Default select example"
            className="dialog-form"
          >
            {datasetOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="dialog-box">
          <label>想儲存的模型名稱</label>
          <input
            type="text"
            value={weightName}
            onChange={(e) => setWeightName(e.target.value)}
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
    </BaseModal>
  );
}

export default function AIModel() {
  const [open, setOpen] = useState(false);
  const [trainOpen, setTrainOpen] = useState(false);
  const [modelData, setModelData] = useState([]);
  const [openDrawerId, setOpenDrawerId] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [helloOpen, setHelloOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedModelType, setSelectedModelType] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const startTrainButtonRef = React.useRef(null);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [currentPrecision, setCurrentPrecision] = useState(null);
  const [currentRecall, setCurrentRecall] = useState(null);

  const handleTrainClick = (item) => {
    setOpenDrawerId(item.model_id);
    setTrainOpen(true);
  };

  const handleDeployClick = (item) => {
    setSelectedItem(item);
    setSelectedModelType(item.model_type);
    setHelloOpen(true);
  };

  const handleStartTrainClick = (weightName) => {
    fetch(`${process.env.REACT_APP_ENDPOINT_TRAINER}/train/trainingStatus`)
      .then((res) => res.json())
      .then((data) => {
        if (data.state === true) {
          alert("開始訓練");
          setIsTraining(true);

          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

          const urlencoded = new URLSearchParams();
          const firstWeightId = modelData.data.find(model => model.model_id === selectedItem.model_id)?.weights[0]?.weight_id;
          urlencoded.append("base_weight_id", firstWeightId || "286");
          urlencoded.append("weight_name", weightName);
          urlencoded.append("model_id", selectedItem.model_id);

          const selectedDataset = datasetMapping[selectedModelType];
          if (selectedDataset) {
            urlencoded.append("train_path", selectedDataset.train_path);
            urlencoded.append("valid_path", selectedDataset.val_path);
          } else {
            urlencoded.append("train_path", "");
            urlencoded.append("valid_path", "");
          }

          const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: urlencoded,
            redirect: "follow",
          };

          fetch(`${process.env.REACT_APP_ENDPOINT_TRAINER}/train/trainingConfig`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));

          // setOpenDrawerId(selectedItem);
          setTrainOpen(true);
        } else {
          alert("訓練中，請稍後再試");
          setIsTraining(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleHelloModalConfirm = (weightName) => {
    handleStartTrainClick(weightName);
    setHelloOpen(false);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_ENDPOINT_MODEL_MANAGER}/modelManager/getModelTable`)
      .then((res) => res.json())
      .then((data) => {
        setModelData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (isTraining && startTrainButtonRef.current) {
      startTrainButtonRef.current.innerText = "訓練中，請稍後再試";
    }
  }, [isTraining]);

  const handleStartDeployClick = (modelId, weightId) => {
    // Add your deployment logic here
    console.log('Deploying model:', modelId, 'with weight:', weightId);
    // Example:
    const url = `${process.env.REACT_APP_ENDPOINT_MODEL_MANAGER}/modelManager/depolyModel?model_id=${modelId}&weight_id=${weightId}`;
    fetch(url)
      .then(response => response.json()) 
      .then(data => {
        console.log('Deploy success:', data);
        setTrainOpen(false);
      })
      .catch(error => console.error('Deploy error:', error));
  };

  const handleButtonClick = (item, weight) => {
    setSelectedWeight(weight);
    setCurrentVersion(weight.weight_name);
    setCurrentPrecision(Number(weight.Precision).toFixed(2));
    setCurrentRecall(Number(weight.Recall).toFixed(2));
    setActiveButton(weight.weight_id);
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
          {Array.isArray(modelData.data) &&
            modelData.data.map((item) => (
              <ModelCard
                key={item.model_id}
                modelType={item.model_type}
                modelName={modelTypeMapping[item.model_type]}
                fScore={item.weights.find(w => w.weight_state)?.F_score || 0}
                onTrain={() => handleDeployClick(item)}
                onDeploy={() => handleTrainClick(item)}
              />
            ))}
        </div>
      </div>

      <SettingModal openModal={open} closeModal={() => setOpen(false)} />
      <HelloModal
        openHelloModal={helloOpen}
        closeHelloModal={() => setHelloOpen(false)}
        onConfirm={handleHelloModalConfirm}
        selectedModelType={selectedModelType}
      />

      <Drawer
        open={trainOpen}
        onClose={() => setTrainOpen(false)}
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
        {Array.isArray(modelData.data) &&
          modelData.data
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
                  onClick={() => setTrainOpen(false)}
                >
                  {item.weights
                    .filter(
                      (weight) => weight.weight_state === true
                    )
                    .map((weight) => (
                      <React.Fragment key={weight.weight_name}>
                        <div className="offcanvas-text">
                          <span>目前使用版本</span>
                          <span id="currentVersion">{currentVersion || weight.weight_name}</span>
                        </div>
                        <div className="offcanvas-text">
                          <span>精確率</span>
                          <span id="currentPrecision">{currentPrecision || Number(weight.Precision).toFixed(2)}</span>
                        </div>
                        <div className="offcanvas-text">
                          <span>召回率</span>
                          <span id="currentRecall">{currentRecall || Number(weight.Recall).toFixed(2)}</span>
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
                    ref={startTrainButtonRef}
                    className="aibutton"
                    onClick={() => handleStartDeployClick(item.model_id, selectedWeight.weight_id)}
                    style={{
                      marginRight: "10px",
                      width: "100px",
                    }}
                  >
                    佈署
                  </button>
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
                          onClick={() =>
                            handleButtonClick(item, weight)
                          }
                          hidden={activeButton === weight.weight_id}
                        >
                          切換
                        </button>
                      </div>
                      <Divider
                        sx={{
                          border: "0.8px solid rgba(189, 188, 183, 1)",
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
  );
}
