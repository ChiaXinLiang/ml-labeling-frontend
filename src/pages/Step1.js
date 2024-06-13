import * as React from "react";
import Divider from "@mui/material/Divider";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function Step1({ onFileChange, Title, Description, Knowledge, closeModal }) {
  const [fileUrl, setFileUrl] = React.useState([]);
  const [inputUrl, setInputUrl] = React.useState("");
  const [showPhoto, setShowPhoto] = React.useState(false);
  const [files, setFiles] = React.useState([]);

  React.useEffect(() => {
    onFileChange(files);
  }, [files]);

  function Photo() {
    const onDrop = React.useCallback((acceptedFiles) => {
      if (acceptedFiles?.length) {
        const newFiles = acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        );
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ accept: { "image/*": [] }, onDrop });

    return (
      <section className="filecontainer">
        <div {...getRootProps({ className: "dropzone" })}>
          <p>瀏覽或將檔案拖曳至此</p>
          <input {...getInputProps()} />
          {files.length > 0 ? (
            files.map((file, index) => (
              <img
                key={index}
                src={file.preview}
                alt="preview"
                width="100"
                height="100"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                  margin: "5px",
                }}
              />
            ))
          ) : (
            <img
              src="/upload.png"
              alt="upload"
              width="50"
              height="50"
              style={{
                objectFit: "contain",
              }}
            />
          )}
          <p style={{ fontSize: "12px" }}>
            Images : jpg, jpeg, png, gif, bmp, svg, webp
          </p>
          <p style={{ marginTop: "38%", fontSize: "12px" }}>
            * 支援取決於瀏覽器
            <br />* 想匯入更大的檔案，請使用雲端硬碟
          </p>
        </div>
      </section>
    );
  }

  const handleImg = () => {
    setShowPhoto(true);
  };

  const handleInputChange = (e) => {
    setInputUrl(e.target.value);
  };

  const handleButtonClick = () => {
    setFileUrl([...fileUrl, inputUrl]);
  };

  const HandleSubmit = () => {
    const sendFirstRequest = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_LAYER2_ENDPOINT}/projects`,
          {
            title: Title,
            description: Description,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const projectId = response.data.id;

        console.log("Project ID:", projectId);

        const sendSecondRequest = async (id) => {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_API_ENDPOINT}/projects/${id}/knowledge/add`,
              {
                knowledge: Knowledge,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            console.log("Second API Response:", response.data);

            const formData = new FormData();
            files.forEach((file) => {
              formData.append("files", file);
            });

            const response2 = await axios.post(
              `${process.env.REACT_APP_LAYER2_ENDPOINT}/projects/${id}/import`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            console.log("Third API Response:", response2.data);
          } catch (error) {
            console.error("Error in second request:", error);
            alert("Error create project. Please try again.");
          }
        };

        sendSecondRequest(projectId);
      } catch (error) {
        console.error("Error in first request:", error);
        alert("Error create project. Please try again.");
      }
    };

    sendFirstRequest();
    closeModal();
  };

  return (
    <>
      <div style={{ marginTop: "20px" }}>
        <input
          type="url"
          id="url"
          name="url"
          placeholder="資料集網址"
          value={inputUrl}
          onChange={handleInputChange}
          style={{
            width: "40%",
            marginLeft: "-280px",
            height: "26px",
            borderRadius: "5px",
            border: "black solid 1px",
          }}
        />
        <button
          type="submit"
          className="step1-button"
          onClick={handleButtonClick}
        >
          新增網址
        </button>
        <span>或</span>
        <button className="step1-button" onClick={handleImg}>
          上傳檔案
        </button>
      </div>
      {showPhoto && <Photo />}
      {!showPhoto && (
        <div
          style={{
            marginTop: "30px",
            display: "flex",
          }}
        >
          <div style={{ flex: "3" }}>
            {fileUrl.map((url) => (
              <div
                key={url}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "90%",
                  height: "26px",
                  border: "1px solid black",
                  borderRadius: "5px",
                  marginLeft: "5%",
                }}
              >
                <span
                  style={{ display: "flex", marginLeft: "10px", flex: "6" }}
                >
                  {url}
                </span>
                <button className="step1-add-button">加入</button>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flex: "3",
              backgroundColor: "rgba(225, 234, 240, 1)",
              height: "250px",
            }}
          >
            <span style={{ marginBottom: "16px", marginRight: "58%" }}>
              已加入的資料及清單
            </span>
            <div
              style={{
                width: "85%",
                height: "72%",
                border: "1px solid black",
              }}
            ></div>
          </div>
        </div>
      )}
      <Divider
        variant="middle"
        sx={{ backgroundColor: "rgba(122, 122, 120, 1)", marginTop: "30px" }}
      />
      <button onClick={HandleSubmit}>提交</button>
    </>
  );
}