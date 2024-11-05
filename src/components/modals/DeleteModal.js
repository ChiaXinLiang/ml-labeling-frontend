import React from "react";
import BaseModal from "./BaseModal";

export default function DeleteModal({ 
  openModal, 
  closeModal, 
  selectedIds, 
  onDelete,
  type = "專案" // Can be "專案", "資料集", etc.
}) {
  return (
    <BaseModal
      openModal={openModal}
      closeModal={closeModal}
      onSubmit={onDelete}
      className="deleteModal"
      submitText="確定"
      cancelText="取消"
      showFooter={false}
    >
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
          <img src={`${process.env.PUBLIC_URL}/warn.png`} alt="warn" width={30} />
          確定刪除所選之{type}嗎?
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
            onClick={onDelete}
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
    </BaseModal>
  );
}
