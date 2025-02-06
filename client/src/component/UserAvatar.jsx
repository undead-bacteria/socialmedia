import React from "react";
import { Avatar } from "@mui/material";

const UserAvatar = ({ name, avatar }) => {
  const userInitial = name && name[0] ? name[0].toUpperCase() : "";
  return (
    <>
      {avatar ? (
        <Avatar src={avatar} sx={{ width: 45, height: 45 }} />
      ) : (
        <Avatar sx={{ width: 45, height: 45, fontSize: "2rem" }}>
          {userInitial}
        </Avatar>
      )}
    </>
  );
};

export default UserAvatar;
