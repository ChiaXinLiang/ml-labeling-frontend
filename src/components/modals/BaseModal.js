import React, { useEffect, useRef } from "react";
import Divider from "@mui/material/Divider";

export default function BaseModal({ 
  openModal, 
  closeModal, 
  title,
  children,
  onSubmit,
  submitText = "確定",
  cancelText = "取消",
  showFooter = true,
  className = "modalClassName"
}) {
  const ref = useRef();

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  const handleOverlayClick = (event) => {
    if (event.target === ref.current) {
      closeModal();
    }
  };

  return (
    <dialog ref={ref} onClick={handleOverlayClick} onCancel={closeModal} className={className}>
      <div style={{ display: "flex" }}>
        <h2 style={{ display: "flex", marginLeft: "5%", flex: "1" }}>{title}</h2>
        {showFooter && (
          <div style={{ display: "flex", flex: "1", margin: "20px", gap: "10px", marginLeft: "50%" }}>
            <button
              onClick={closeModal}
              style={{
                height: "30px",
                borderRadius: "10px",
                backgroundColor: "white",
                color: "red",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                border: "none",
                width: "80px",
                cursor: "pointer",
              }}
            >
              {cancelText}
            </button>
            <button
              type="submit"
              onClick={onSubmit}
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
              {submitText}
            </button>
          </div>
        )}
      </div>
      <Divider variant="middle" sx={{ backgroundColor: "rgba(122, 122, 120, 1)" }} />
      {children}
    </dialog>
  );
}
