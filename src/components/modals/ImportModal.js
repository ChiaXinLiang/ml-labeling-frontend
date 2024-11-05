import React, { useState, useEffect, useCallback } from "react";
import BaseModal from "./BaseModal";
import { useDropzone } from "react-dropzone";

function UploadImg({ onFilesChange, shouldReset }) {
  const [inputUrl, setInputUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      const newFiles = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setPreviews(prev => [...prev, ...newFiles]);
      setFiles(prev => [...prev, ...acceptedFiles]);
    }
  }, []);

  useEffect(() => {
    if (files.length > 0) {
      onFilesChange(files);
    }
  }, [files, onFilesChange]);

  // Reset state when shouldReset changes
  useEffect(() => {
    if (shouldReset) {
      // Clean up old previews
      previews.forEach(preview => URL.revokeObjectURL(preview.preview));
      setFiles([]);
      setPreviews([]);
      setInputUrl("");
    }
  }, [shouldReset, previews]);

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.preview));
    };
  }, [previews]);

  const { getRootProps, getInputProps } = useDropzone({ 
    accept: { "image/*": [] }, 
    onDrop 
  });

  const handleInputChange = (e) => {
    setInputUrl(e.target.value);
  };

  return (
    <>
      <div style={{ marginTop: "20px" }}>
        <input
          type="url"
          name="url"
          placeholder="資料集網址"
          value={inputUrl}
          onChange={handleInputChange}
          style={{
            width: "40%",
            marginLeft: "-280px",
            height: "30px",
            borderRadius: "5px",
            border: "black solid 1px",
          }}
        />
        <button type="submit" className="step1-button">
          新增網址
        </button>
        <span>或</span>
        <button className="step1-button">
          上傳檔案
        </button>
      </div>
      <section className="filecontainer">
        <div {...getRootProps({ className: "dropzone" })}>
          <p>瀏覽或將檔案拖曳至此</p>
          <input {...getInputProps()} />
          {previews.length > 0 ? (
            previews.map((preview, index) => (
              <img
                key={index}
                src={preview.preview}
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
              src={`${process.env.PUBLIC_URL}/upload.png`}
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
          </p>
        </div>
      </section>
    </>
  );
}

export default function ImportModal({ openModal, closeModal, onImport, projectId, onSuccess }) {
  const [files, setFiles] = useState([]);
  const [shouldResetUpload, setShouldResetUpload] = useState(false);

  const handleImport = async () => {
    if (files.length === 0) {
      alert("Please select files to import");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(
        `${process.env.REACT_APP_LAYER2_ENDPOINT}/projects/${projectId}/import`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log(data);
      alert("Data imported successfully");
      
      // Reset states
      setFiles([]);
      setShouldResetUpload(true);
      
      // Notify parent components
      if (onSuccess) onSuccess(data);
      closeModal();
    } catch (error) {
      console.error("Error:", error);
      alert("Error importing data");
    }
  };

  // Reset shouldResetUpload after it's been used
  useEffect(() => {
    if (shouldResetUpload) {
      setShouldResetUpload(false);
    }
  }, [shouldResetUpload]);

  // Reset states when modal closes
  useEffect(() => {
    if (!openModal) {
      setFiles([]);
      setShouldResetUpload(true);
    }
  }, [openModal]);

  return (
    <BaseModal
      openModal={openModal}
      closeModal={closeModal}
      title="匯入資料"
      onSubmit={handleImport}
      submitText="匯入"
      cancelText="取消"
    >
      <UploadImg 
        onFilesChange={setFiles} 
        shouldReset={shouldResetUpload}
      />
    </BaseModal>
  );
}
