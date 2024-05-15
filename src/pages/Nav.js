import { IconButton, Avatar, Menu, MenuItem, Divider } from "@mui/material";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function SideMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <img src="/menu.png" alt="menu" width="30" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            width: 130,
            backgroundColor: "white",
            color: "rgba(75, 84, 38, 0.7)",
            borderRadius: 4,
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <img
            src="/map.png"
            alt="map"
            style={{ width: "25px", marginRight: "5px" }}
          />
          標注專案
        </MenuItem>
        <MenuItem>
          {" "}
          <img
            src="/score.png"
            alt="map"
            style={{ width: "25px", marginRight: "5px" }}
          />
          資料集
        </MenuItem>
        <MenuItem>
          {" "}
          <img
            src="/ai.png"
            alt="map"
            style={{ width: "25px", marginRight: "5px" }}
          />
          AI 模型
        </MenuItem>
        <MenuItem>
          {" "}
          <img
            src="/prohibit.png"
            alt="map"
            style={{ width: "25px", marginRight: "5px" }}
          />
          禁區設定
        </MenuItem>
      </Menu>
      <div className={`backdrop ${open ? "open" : ""}`} onClick={handleClose} />
    </>
  );
}

function UserMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 4 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar sx={{ width: 32, height: 32 }}>YI</Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            width: 200,
            backgroundColor: "white",
            color: "rgba(75, 84, 38, 0.7)",
            borderRadius: 4,
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "5px",
          }}
        ></div>
        <MenuItem onClick={handleClose}>帳號&設定</MenuItem>
        <Divider />
        <MenuItem>登出</MenuItem>
      </Menu>
    </>
  );
}

export default function Nav({ projectDataById }) {
  const [isRoot, setIsRoot] = useState(false);
  const location = useLocation();
  const isProjectPage = location.pathname.startsWith("/project/");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginLeft: "20px",
      }}
    >
      <img src="/Logo.png" alt="logo" width="150" />
      {/* <IconButton>
        <img src="/menu.png" alt="menu" width="30" />
      </IconButton> */}
      <SideMenu />
      <div className="vl"></div>
      <span style={{ display: "flex", marginLeft: "60px", flex: "4" }}>
        {isProjectPage ? (
          <>
            <div
              style={{ color: isRoot ? "#1890ff" : "inherit", opacity: 0.5 }}
              onMouseEnter={() => setIsRoot(true)}
              onMouseLeave={() => setIsRoot(false)}
            >
              <Link
                to={"/"}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                專案
              </Link>
            </div>
            <span>／{projectDataById ? projectDataById.title : ""}</span>
          </>
        ) : (
          <span>專案</span>
        )}
      </span>
      <div style={{ flex: "1" }}>
        <button className="button">設定</button>
        <UserMenu />
      </div>
      <div className="hr"></div>
    </div>
  );
}
