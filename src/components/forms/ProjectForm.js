import React from "react";

export default function ProjectForm({ onUpdateTitle, onUpdateDescription }) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "30px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <label
          htmlFor="name"
          style={{ marginLeft: "-50%", marginBottom: "5px" }}
        >
          專案名稱
        </label>
        <input
          required
          id="name"
          name="name"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            onUpdateTitle(e.target.value);
          }}
          style={{
            width: "62%",
            borderRadius: "10px",
            border: "black solid 1px",
            lineHeight: "38px",
            fontSize: "18px",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "30px",
        }}
      >
        <label
          htmlFor="description"
          style={{ marginLeft: "-50%", marginBottom: "5px" }}
        >
          專案描述
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            onUpdateDescription(e.target.value);
          }}
          rows="6"
          cols="10"
          style={{
            fontSize: "16px",
            height: "80px",
            width: "62%",
            borderRadius: "10px",
            border: "black solid 1px",
          }}
        />
      </div>
    </div>
  );
}
