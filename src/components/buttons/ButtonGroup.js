import React from "react";
import ActionButton from "./ActionButton";

export default function ButtonGroup({ 
  onImport,
  onExport,
  onDelete,
  onVerify,
  showOperations = true,
  showImportExport = true
}) {
  return (
    <div style={{ 
      display: "flex", 
      gap: "20px", 
      alignItems: "center", 
      marginLeft: "30px", 
      marginTop: "20px" 
    }}>
      {showOperations && (
        <>
          <button className="button">操作</button>
          <button className="button">欄位</button>
          <button className="button">篩選器</button>
          <span style={{ fontSize: "14px", color: "gray" }}>順序</span>
          <button className="button">未設定</button>
          <button className="button" onClick={onVerify}>驗證</button>
          <button className="button" onClick={onDelete}>刪除</button>
        </>
      )}
      
      {showImportExport && (
        <div style={{ 
          display: "flex", 
          marginLeft: "auto", 
          alignItems: "center", 
          gap: "10px" 
        }}>
          <button
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "5px",
              backgroundColor: "#09f",
              border: "none",
            }}
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "20px", height: "20px" }}
            >
              <path
                d="M5.85708 4.35708L4 2.5L3 8.5L9 7.5L7.29451 5.79451C8.07439 5.29174 9.00314 5 10 5V3C8.4497 3 7.01708 3.504 5.85708 4.35708Z"
                fill="currentColor"
              ></path>
              <path
                d="M5.52692 12.2366C6.34781 13.8751 8.04256 15 10 15V17C7.25957 17 4.88691 15.4252 3.73767 13.1312L5.52692 12.2366Z"
                fill="currentColor"
              ></path>
              <path
                d="M14.1429 15.6429L16 17.5L17 11.5L11 12.5L12.7055 14.2055C11.9256 14.7083 10.9969 15 10 15V17C11.5504 17 12.9829 16.496 14.1429 15.6429Z"
                fill="currentColor"
              ></path>
              <path
                d="M14.4731 7.76344C13.6522 6.12486 11.9575 5 10 5V3C12.7405 3 15.1131 4.5748 16.2623 6.86882L14.4731 7.76344Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
          <ActionButton onClick={onImport}>匯入</ActionButton>
          <ActionButton onClick={onExport}>匯出</ActionButton>
        </div>
      )}
    </div>
  );
}
