import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";

const optionsForModel = {
  1: [
    "電線桿(pole)",
    "絕緣毯(insulation_blanket)",
    "橡皮線管(rubber_pipe)",
    "昇空車(versalift)",
    "昇空桶(platform)",
    "平面感電物件(electric_box)",
    "鐵塔、電塔(electric_tower)",
    "人孔蓋(manhole_cover)",
    "人孔洞(manhole)",
    "工作梯-合梯(step_ladder)",
    "工作梯-直梯(extension_ladder)",
    "高空作業車_剪刀式(liftcar_scissor)",
    "挖土機(excavator)",
    "挖斗(bucket)",
    "吊臂車(crane)",
    "索道吊桶(ropeway_bucket)",
    "軌道台車(trolley)",
    "直臂式高空作業車(liftcar)",
    "直臂式高空作業平台(working_platform)",
    "電焊火花(sparkling)",
  ],
  2: [
    "交通錐(traffic_cone)",
    "連桿(connecting_rod)",
    "施工告示牌(notification_billboard)",
    "拒馬(barricades)",
  ],
  3: [
    "通風管(ventiduct)",
    "人孔蓋口_孔蓋安全防護網(manhole_safety_net)",
    "滅火器(fire_extinguisher)",
    "氣體測定器(gas_detector)",
    "空氣呼吸器(氧氣瓶)(oxygen_tank)",
    "人孔圍籬(construction_fence)",
    "三腳架(tripod)",
  ],
  4: ["火焰(fire)", "煙霧(smoke)"],
  5: [
    "安全帽(safety_helmet)",
    "反光背心(reflective_vest)",
    "掛桿式安全帶(waist_harness)",
    "背負式安全帶(body_harness)",
    "羊皮手套(leather_gloves)",
    "絕緣手套(insulate_gloves)",
    "絕緣鞋(insulating_boots)",
    "絕緣肩套(insulating_sleeves)",
    "活電作業防護面罩(electric_protective_mask)",
    "電銲面罩(welding_face_shield)",
    "防護衣(protective_clothing)",
    "安全帶輔助繩(safety_rope)",
    "安全鞋(safety_boots)",
    "捲揚式防墜器(self_retracting_lifeline)",
    "香煙(cigarette)",
  ],
  6: [
    "昇空車外伸撐座(outrigger)",
    "止滑墊（輪檔）	(wheel_stopper)",
    "輪胎(truck_wheel)",
    "卡車車身(truck)",
    "吊臂車外伸撐座(outrigger)",
    "接地銅棒(copper_rod)",
  ],
  7: [
    "絕緣毯(insulation_blanket)",
    "橡皮線管(rubber_pipe)",
    "熔絲鏈開關(cutout_switch)",
    "操作棒(hook_stick)",
    "檢電筆(test_pencil)",
    "接地線(grounding_wire)",
  ],
  8: ["捲揚式防墜器(self_retracting_lifeline)"],
  9: ["掛勾(bucket_hook)"],
};

const optionsMark = {
  0: ["標注方式"],
  1: ["方形（bounding box）"],
  2: ["多邊形（polygon）"],
  3: ["多邊形（polygon）"],
  4: ["方形（bounding box）"],
  5: ["多邊形（polygon）"],
  6: ["多邊形（polygon）"],
  7: ["多邊形（polygon）"],
  8: ["多邊形（polygon）"],
  9: ["多邊形（polygon）"],
};

export default function Step2({ onKnowledgeDataChange }) {
  const [selectedModel, setSelectedModel] = useState("0");
  const [selectKnowledge, setSelectKnowledge] = useState([]);
  //console.log(selectedModel);

  const handleAddObject = () => {
    const model = document.querySelector(
      'select[aria-label="Default select example"]:nth-child(1)'
    ).value;
    const category = document.querySelector(
      'select[aria-label="Default select example"]:nth-child(2)'
    ).value;
    const shape = document.querySelector('input[name="option"]').value;

    const newObject = {
      模型名稱: optionsForModel[model] ? optionsForModel[model][0] : undefined,
      分類: optionsForModel[model]
        ? optionsForModel[model][category]
        : undefined,
      形狀: shape,
    };

    if (
      selectedModel === "0" ||
      !model ||
      model === "0" ||
      !category ||
      category === "分類" ||
      !shape
    ) {
      alert("請選擇模型名稱、分類");
      return;
    }

    setSelectKnowledge((prevKnowledge) => {
      const newKnowledge = [...prevKnowledge, newObject];
      //onKnowledgeDataChange(newKnowledge); // Call the callback function
      return newKnowledge;
    });
  };

  function deleteKnowledge(index) {
    setSelectKnowledge((prevState) => prevState.filter((_, i) => i !== index));
  }

  useEffect(() => {
    onKnowledgeDataChange(selectKnowledge);
  }, [selectKnowledge, onKnowledgeDataChange]);

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
              <div style={{ display: "flex" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) => setSelectedModel(e.target.value)}
                    style={{
                      width: "160px",
                      height: "30px",
                      borderRadius: "5px",
                    }}
                  >
                    <option value="0">模型名稱</option>
                    <option value="1">背景模型</option>
                    <option value="2">交通設備模型</option>
                    <option value="3">侷限空間設備模型</option>
                    <option value="4">異常災害模型</option>
                    <option value="5">安全裝束模型</option>
                    <option value="6">營建系車輛配件模型</option>
                    <option value="7">電線桿配件模型</option>
                    <option value="8">侷限空間配件模型</option>
                    <option value="9">挖斗配件模型</option>
                  </Form.Select>

                  <Form.Select
                    aria-label="Default select example"
                    style={{
                      width: "160px",
                      height: "30px",
                      borderRadius: "5px",
                    }}
                  >
                    <option>分類</option>
                    {optionsForModel[selectedModel]?.map((option, index) => (
                      <option value={index}>{option}</option>
                    ))}
                  </Form.Select>

                  {optionsMark[selectedModel]?.map((option, index) => (
                    <div key={index} style={{ marginLeft: "50px" }}>
                      <input
                        name="option"
                        value={option}
                        readOnly
                        style={{
                          height: "30px",
                          marginTop: "-10px",
                          borderRadius: "5px",
                          border: "1px solid black",
                        }}
                      />
                    </div>
                  ))}
                  <button
                    style={{
                      width: "80px",
                      height: "30px",
                      borderRadius: "10px",
                      border: "none",
                      backgroundColor: "rgba(23, 115, 185, 1)",
                      color: "white",
                      marginLeft: "30px",
                      marginTop: "-10px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handleAddObject();
                    }}
                  >
                    新增
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "98%",
            height: "145px",
            overflowY: "scroll",
            overflowX: "hidden",
            marginLeft: "2%",
          }}
        >
          {selectKnowledge.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
              }}
            >
              <p>模型名稱: {item.模型名稱}</p>
              <p>分類: {item.分類}</p>
              <p>形狀: {item.形狀}</p>
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
                    cursor: "pointer",
                  }}
                  onClick={() => deleteKnowledge(index)}
                >
                  刪除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
