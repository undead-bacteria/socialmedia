import axios from "axios";
import React, { useState } from "react";
import { Box } from "@mui/material";
import TabContext from "@mui/lab/TabContext/TabContext";
import TabPanel from "@mui/lab/TabPanel/TabPanel";
import { getAccessToken } from "../utils/helper";
import { useQuery } from "react-query";
import Loading from "../component/Loading";
import MyProfile from "../component/MyProfile";
import UserPosts from "../component/UserPosts";
import AboutMe from "../component/AboutMe";
import FriendsTab from "../component/FriendsTab";
import Photos from "../component/Photos";
import { config } from "../config/config";
import { useSelector } from "react-redux";

const Profile = () => {
  const auth = useSelector((state) => state.auth.user);
  const [value, setValue] = useState("2");

  async function fetchUserInfo(email) {
    const { data } = await axios.get(config.urls.user.getUserInfo(email), {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
    });

    console.log("from fetch user info profile", data);
    return data.data;
  }

  const { data, error, isError, isLoading } = useQuery("userInfo", () =>
    fetchUserInfo(auth.email)
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <TabContext value={value}>
      <Box>
        <MyProfile
          value={value}
          setValue={setValue}
          userLocation={data.location}
          userName={data.name}
          userCoverImage={data?.coverImage}
          userProfileImage={data?.profileImage}
        />
        <TabPanel value="1" sx={{ padding: 0 }}>
          <UserPosts />
        </TabPanel>
        <TabPanel value="2" sx={{ padding: 0 }}>
          <AboutMe description={data.description} />
        </TabPanel>
        <TabPanel value="3" sx={{ padding: 0 }}>
          <FriendsTab />
        </TabPanel>
        <TabPanel value="4" sx={{ padding: 0 }}>
          <Photos />
        </TabPanel>
      </Box>
    </TabContext>
  );
};

export default Profile;
