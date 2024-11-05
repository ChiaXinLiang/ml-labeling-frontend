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
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label>基礎訓練模型</label>
          <select style={{ marginLeft: "10px" }}>
            {modelOptions.map((option, index) => (
              <option key={index} value={option.weightName}>
                {option.weightName}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label>選擇訓練集</label>
          <select style={{ marginLeft: "10px" }}>
            {datasetOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label>想儲存的模型名稱</label>
          <input
            type="text"
            value={weightName}
            onChange={(e) => setWeightName(e.target.value)}
            style={{
              marginLeft: "10px",
              borderRadius: "5px",
              backgroundColor: "rgba(217, 217, 217, 1)",
              border: "none",
              padding: "5px",
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

          setOpenDrawerId(selectedItem);
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
        {/* Drawer content */}
      </Drawer>
    </div>
  );
}
