import axios from "axios";
import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { getAccessToken } from "../utils/helper";
import { useQuery } from "react-query";
import Loading from "../component/Loading";
import MyProfile from "../component/MyProfile";
import UserPosts from "../component/UserPosts";
import AboutMe from "../component/AboutMe";
import FriendsTab from "../component/FriendsTab";
import Photos from "../component/Photos";
import { config } from "../config/config";

const Profile = () => {
  const [value, setValue] = useState("2");

  async function fetchUserInfo() {
    const { data } = await axios.get(config.urls.user.getUserInfo(), {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
    });

    return data.data;
  }

  const { data, error, isError, isLoading } = useQuery("userInfo", () =>
    fetchUserInfo()
  );

  if (isLoading) {
    return <Loading />;
  }

  const handleTabChange = (event, newValue) => setValue(newValue);

  return (
    <Box>
      <MyProfile
        value={value}
        setValue={setValue}
        userLocation={data.location}
        userName={data.name}
        userCoverImage={data?.coverImage}
        userProfileImage={data?.profileImage}
      />
      <Tabs value={value} onChange={handleTabChange} aria-label="profile tabs">
        <Tab label="Posts" value="1" />
        <Tab label="About" value="2" />
        <Tab label="Following" value="3" />
        <Tab label="Photos" value="4" />
      </Tabs>

      {/* Conditional rendering for tab panels */}
      {value === "1" && <UserPosts />}
      {value === "2" && <AboutMe description={data.description} />}
      {value === "3" && <FriendsTab />}
      {value === "4" && <Photos />}
    </Box>
  );
};

export default Profile;
