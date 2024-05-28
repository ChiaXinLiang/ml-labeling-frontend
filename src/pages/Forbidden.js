import React, { useEffect } from "react";
import Nav from "./Nav";

const initialItems = [
  {
    id: 1,
    name: "挖土機", // excavator
    a: "",
    b: "",
  },
  {
    id: 2,
    name: "昇空車", // liftcar
    a: "",
    b: "",
  },
  {
    id: 3,
    name: "直臂式高空作業車", // versalift
    a: "",
    b: "",
  },
  {
    id: 4,
    name: "吊臂車", // crane
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = new URL(`${process.env.REACT_APP_FORBIDDEN_API_ENDPOINT}/settingManager/getRadiusConfig`);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        const result = await response.json();

        if (result.code === 0 && result.state === 1) {
          const nameMapping = {
            crane: "吊臂車",
            excavator: "挖土機",
            liftcar: "昇空車",
            versalift: "直臂式高空作業車"
          };

          const fetchedItems = result.data.map(item => ({
            id: item.vehicle_id,
            name: nameMapping[item.vehicle_type] || item.vehicle_type,
            a: item.a_radius,
            b: item.b_radius
          }));

          setItems(fetchedItems);
          const fetchedInputs = fetchedItems.reduce((acc, item) => {
            acc[item.id] = { a: item.a, b: item.b };
            return acc;
          }, {});
          setInputs(fetchedInputs);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (id, key, value) => {
    setInputs({
      ...inputs,
      [id]: { ...inputs[id], [key]: value },
    });
  };

  const handleSubmit = async (id) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, ...inputs[id] } : item
    );
    setItems(updatedItems);

    try {
      const url = `${process.env.REACT_APP_FORBIDDEN_API_ENDPOINT}/settingManager/setRadius`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          vehicle_id: id.toString(),
          a_radius: inputs[id].a,
          b_radius: inputs[id].b
        })
      });
      const result = await response.json();
      if (result.code === 0) {
        alert("設定成功");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
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
                padding: "10px",
              }}
            >
              <p style={{ margin: 0 }}>
                {item.name} (a={inputs[item.id]?.a || ''} 、b={inputs[item.id]?.b || ''} )
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
                  value={inputs[item.id]?.a || ""}
                  onChange={(e) =>
                    handleInputChange(item.id, "a", e.target.value)
                  }
                />
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
                  value={inputs[item.id]?.b || ""}
                  onChange={(e) =>
                    handleInputChange(item.id, "b", e.target.value)
                  }
                />
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