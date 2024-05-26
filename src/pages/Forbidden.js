import React from "react";
import Nav from "./Nav";

const initialItems = [
  {
    id: 1,
    name: "挖土機",
    a: "",
    b: "",
  },
  {
    id: 2,
    name: "昇空車",
    a: "",
    b: "",
  },
  {
    id: 3,
    name: "直臂式高空作業車",
    a: "",
    b: "",
  },
  {
    id: 4,
    name: "吊臂車",
    a: "",
    b: "",
  },
];

export default function Forbidden() {
  const [items, setItems] = React.useState(initialItems);
  const [inputs, setInputs] = React.useState(
    initialItems.reduce((acc, item) => {
      acc[item.id] = { a: item.a, b: item.b };
      return acc;
    }, {})
  );

  const handleInputChange = (id, key, value) => {
    setInputs({
      ...inputs,
      [id]: { ...inputs[id], [key]: value },
    });
  };

  const handleSubmit = (id) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, ...inputs[id] } : item
    );
    setItems(updatedItems);
  };

  //console.log("items", items);
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
        <h2 style={{ display: "flex", justifyContent: "start" }}>危險半徑</h2>
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
                height: "180px",
                borderRadius: "10px",
              }}
            >
              <p style={{ height: "45px" }}>
                {item.name} (a={item.a} 、b={item.b} )
              </p>
              <div style={{ marginBottom: "10px" }}>
                <span>a : </span>
                <input
                  style={{
                    width: "80px",
                    height: "25px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "rgba(217, 217, 217, 1)",
                  }}
                  value={inputs[item.id].a}
                  onChange={(e) =>
                    handleInputChange(item.id, "a", e.target.value)
                  }
                ></input>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <span>b : </span>
                <input
                  style={{
                    width: "80px",
                    height: "25px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "rgba(217, 217, 217, 1)",
                  }}
                  value={inputs[item.id].b}
                  onChange={(e) =>
                    handleInputChange(item.id, "b", e.target.value)
                  }
                ></input>
              </div>
              <button
                style={{
                  width: "60px",
                  height: "25px",
                  backgroundColor: "rgba(23, 115, 185, 1)",
                  borderRadius: "5px",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={() => handleSubmit(item.id)}
              >
                提交
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
