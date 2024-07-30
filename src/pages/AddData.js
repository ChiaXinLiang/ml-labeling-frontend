import React from "react";
import Nav from "./Nav";
import { useDropzone } from "react-dropzone";

export default function AddData() {
  const [Title, setTitle] = React.useState("");
  const [Description, setDescription] = React.useState("");

  const [file, setFile] = React.useState([]);

  function Photo() {
    const onDrop = React.useCallback((acceptedFiles) => {
      if (acceptedFiles?.length) {
        const file = acceptedFiles[0];
        setFile(Object.assign(file, { preview: URL.createObjectURL(file) }));
      }
    }, []);

    const {
      getRootProps,
      getInputProps,
      // isFocused,
      // isDragAccept,
      // isDragReject,
    } = useDropzone({ accept: { "image/*": [] }, onDrop });

    return (
      <section className="filecontainer">
        <div {...getRootProps({ className: "dropzone" })}>
          <p>瀏覽或將檔案拖曳至此</p>
          <input {...getInputProps()} />
          {file && file.preview ? (
            <img
              src={file.preview}
              alt="preview"
              width="100"
              height="100"
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <img
              src={`${process.env.PUBLIC_URL}/upload.png`}
              alt="upload"
              width="50"
              height="50"
              style={{
                objectFit: "contain",
              }}
            />
          )}
        </div>
      </section>
    );
  }

  return (
    <div>
      <Nav />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "15%",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <label
            htmlFor="name"
            style={{ marginLeft: "-70%", marginBottom: "5px" }}
          >
            資料集名稱
          </label>
          <input
            required
            id="name"
            name="name"
            type="text"
            value={Title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            style={{
              width: "300px",
              borderRadius: "10px",
              border: "black solid 1px",
              lineHeight: "30px",
              fontSize: "18px",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <label
            htmlFor="name"
            style={{ marginLeft: "-90%", marginBottom: "5px" }}
          >
            說明
          </label>
          <input
            required
            id="name"
            name="name"
            type="text"
            value={Description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            style={{
              width: "500px",
              borderRadius: "10px",
              border: "black solid 1px",
              lineHeight: "30px",
              fontSize: "18px",
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          marginTop: "20px",
          marginLeft: "10%",
          backgroundColor: "rgba(23, 115, 185, 0.2)",
          width: "80%",
          height: "400px",
          borderRadius: "10px",
        }}
      >
        <p style={{ marginLeft: "50px" }}>資料集名稱</p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "90%",
            height: "80%",
            backgroundColor: "white",
            marginLeft: "5%",
          }}
        >
          <Photo />
        </div>
      </div>
    </div>
  );
}
