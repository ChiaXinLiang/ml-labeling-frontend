import * as React from "react";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import "./AddProject.css";

function DeleteModal({ openModal, closeModal, selectedIds, onDelete }) {
  const ref = React.useRef();

  React.useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  const handleDelete = () => {
    selectedIds.forEach((id) => {
      console.log(`${process.env.REACT_APP_LAYER2_ENDPOINT}/projects/${id}`);
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
          console.log(`Dataset ${id} deleted successfully:`, data);
          onDelete(id); // 更新UI
        })
        .catch((error) => {
          console.error(`Error deleting dataset ${id}:`, error);
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
            <img src={`${process.env.PUBLIC_URL}/warn.png`} alt="warn" width={30}></img>
            確定刪除所選之資料集嗎?
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

export default function AddDtaCollect({ ProjectData }) {
  const [open, setOpen] = React.useState(false);
  const [datas, setData] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState(null);
  const [selectedIds, setSelectedIds] = React.useState([]);

  React.useEffect(() => {
    setData(ProjectData.results);
  }, [ProjectData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  const handleDeleteDataset = (id) => {
    setData((prevData) => prevData.filter((data) => data.id !== id));
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.filter((selectedId) => selectedId !== id)
    );
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
          <h3 style={{ marginRight: "500px" }}>資料集列表</h3>
          
{/*           <Link to="/datacollect/add">
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
            >
              新增資料集
            </button>
          </Link> */}
          
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
            刪除資料集
          </button>
          <DeleteModal
            openModal={open}
            closeModal={handleClose}
            selectedIds={selectedIds}
            onDelete={handleDeleteDataset}
          />
        </div>
        <div
          style={{
            backgroundColor: "rgba(245, 245, 245, 1)",
            width: "70%",
            height: "400px",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <div style={{ display: "flex" }}>
            <input
              type="checkbox"
              style={{ flex: "1", transform: "scale(0.4)" }}
            />
            <p style={{ flex: "3" }}>資料集名稱</p>
            <p style={{ flex: "1" }}>說明</p>
            <p style={{ flex: "1" }}>數量</p>
            <p style={{ flex: "1" }}>日期</p>
            <p style={{ flex: "1" }}>時間</p>
          </div>
          <hr style={{ width: "90%" }} />
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
                    <p style={{ flex: "3" }}>{data.title}</p>
                  </Link>
                  <p style={{ flex: "1" }}>{data.task_number}</p>
                  <p style={{ flex: "1" }}>{data.num_tasks_with_annotations}</p>
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