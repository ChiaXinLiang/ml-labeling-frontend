import React from "react";
import Nav from "./Nav";
import Form from "react-bootstrap/Form";
import { useState } from "react";
//import Offcanvas from "react-bootstrap/Offcanvas";
import Drawer from "@mui/material/Drawer";
import "./AIModel.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const initialItems = [
  {
    id: 1,
    name: "背景",
    a: "",
    b: "",
  },
  {
    id: 2,
    name: "交通設備",
    a: "",
    b: "",
  },
  {
    id: 3,
    name: "侷限空間設備",
    a: "",
    b: "",
  },
  {
    id: 4,
    name: "異常災害",
  },
  {
    id: 5,
    name: "安全裝束",
    a: "",
    b: "",
  },
  {
    id: 6,
    name: "營建系車輛配件",
    a: "",
    b: "",
  },
  {
    id: 7,
    name: "電線桿配件",
    a: "",
    b: "",
  },
  {
    id: 8,
    name: "侷限空間配件",
    a: "",
    b: "",
  },
  {
    id: 9,
    name: "挖斗配件",
    a: "",
    b: "",
  },
];

function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <div>
      <button onClick={toggleDrawer(true)} className="aibutton">
        訓練
      </button>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        hideBackdrop={false}
        anchor="right"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "500px",
            marginTop: "40px",
          }}
          onClick={toggleDrawer(false)}
        >
          <div className="offcanvas-text">
            <span>目前使用版本</span>
            <span>equipment</span>
          </div>
          <div className="offcanvas-text">
            <span>精確率</span>
            <span>0</span>
          </div>
          <div className="offcanvas-text">
            <span>召回率</span>
            <span>0</span>
          </div>
          <button className="aibutton" style={{ height: "30px" }}>
            佈署
          </button>
        </div>
        <p className="offcanvas-p">安全帽版本模型列表</p>
        <div className="offcanvas-box">
          <div
            style={{
              display: "flex",
              gap: "200px",
              height: "30px",
              marginTop: "10px",
            }}
          >
            <span>xxxxxxxxxxxxxx</span>
            <button className="offcanvas-button">切換</button>
          </div>
          <hr style={{ backgroundColor: "rgba(189, 188, 183, 1)" }} />
        </div>
      </Drawer>
    </div>
  );
}

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

  const [items, setItems] = React.useState(initialItems);
  const [inputs, setInputs] = React.useState(
    initialItems.reduce((acc, item) => {
      acc[item.id] = { a: item.a, b: item.b };
      return acc;
    }, {})
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //   const handleInputChange = (id, key, value) => {
  //     setInputs({
  //       ...inputs,
  //       [id]: { ...inputs[id], [key]: value },
  //     });
  //   };

  //   const handleSubmit = (id) => {
  //     const updatedItems = items.map((item) =>
  //       item.id === id ? { ...item, ...inputs[id] } : item
  //     );
  //     setItems(updatedItems);
  //   };

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
          {items.map((item) => (
            <div
              key={item.id}
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
                {item.name}
              </p>
              <p style={{ height: "10px", display: "flex", marginLeft: "10%" }}>
                F Score
              </p>
              <span
                style={{
                  fontSize: "80px",
                  color: "rgba(23, 115, 185, 0.77)",
                  display: "flex",
                  marginLeft: "10%",
                  lineHeight: "80px",
                }}
              >
                0
              </span>
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
                  style={{
                    width: "60px",
                    height: "25px",
                    backgroundColor: "rgba(11, 151, 34, 1)",
                    borderRadius: "5px",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={handleClickOpen}
                >
                  設定
                </button>
                <SettingModal openModal={open} closeModal={handleClose} />
                {/* <TrainModal /> */}
                <TemporaryDrawer />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
