import Form from "react-bootstrap/Form";

function Select1() {
  return (
    <Form.Select aria-label="Default select example">
      <option></option>
      <option value="0">背景模型</option>
      <option value="1">交通設備模型</option>
      <option value="2">侷限空間設備模型</option>
      <option value="3">異常災害模型</option>
      <option value="4">安全裝束模型</option>
      <option value="5">營建系車輛配件模型</option>
      <option value="6">電線桿配件模型</option>
      <option value="7">侷限空間配件模型</option>
      <option value="8">挖斗配件模型</option>
    </Form.Select>
  );
}

function Select2() {
  return (
    <Form.Select aria-label="Default select example">
      <option></option>
      <option value="0">標注方式</option>
      <option value="1">方形（bounding box)</option>
      <option value="2">多邊形（polygon）</option>
    </Form.Select>
  );
}

export default function Step2() {
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
              <Select1 />
              <Select2 />
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
