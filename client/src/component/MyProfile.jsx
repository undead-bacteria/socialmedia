import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Card,
  IconButton,
  Paper,
  Tabs,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import InfoIcon from "@mui/icons-material/Info";
import PeopleIcon from "@mui/icons-material/People";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import cover1 from "../assets/image/cover1.jpeg";
import EditImage from "../assets/image/edit.png";
import { updateProfileImage, updateProfileText } from "../reactQuery/mutation";

const MyProfile = ({
  value,
  setValue,
  userLocation,
  userName,
  userCoverImage = false,
  userProfileImage,
}) => {
  const auth = useSelector((state) => state.auth.user);

  const [editProfile, setEditProfile] = useState(false);
  const [editImage, setEditImage] = useState(false);

  const [name, setName] = useState(userName);
  const [location, setLocation] = useState(userLocation);
  const [coverImage, setCoverImage] = useState(userCoverImage);
  const [profileImage, setProfileImage] = useState(userProfileImage);

  const [oldName, setOldName] = useState(userName);
  const [oldLocation, setOldLocation] = useState(userLocation);
  const [oldImage, setOldImage] = useState(userCoverImage);

  const saveProfileMutation = useMutation({
    mutationFn: (body) => updateProfileText(body),
  });

  const saveProfileImageMutation = useMutation({
    mutationFn: (body) => updateProfileImage(body),
  });

  const saveProfile = () => {
    saveProfileMutation.mutate({
      name,
      email: auth.email,
      location,
    });
    setEditProfile(false);
    setOldLocation(location);
    setOldName(name);
  };

  const saveCoverImage = () => {
    let formData = new FormData();

    formData.append("images", coverImage);
    formData.append("email", auth.email);
    formData.append("imageType", "cover");

    saveProfileImageMutation.mutate(formData);

    setOldImage(coverImage);
    setEditImage(false);
  };

  const saveProfileImage = () => {
    let formData = new FormData();

    formData.append("images", profileImage);
    formData.append("email", auth.email);
    formData.append("imageType", "profile");

    saveProfileImageMutation.mutate(formData);

    setOldImage(profileImage);
    setEditImage(false);
  };

  const tabChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (profileImage !== undefined) {
      saveProfileImage();
    }
  }, [profileImage]);

  return (
    <Card
      sx={{ height: editProfile ? "24.7rem" : "20.3rem", position: "relative" }}
    >
      {/* Cover Image */}
      <Box sx={{ height: "50%", position: "relative" }}>
        <img
          src={
            coverImage
              ? coverImage.name !== undefined
                ? URL.createObjectURL(coverImage)
                : coverImage
              : cover1
          }
          alt="loading"
          height="100%"
          width="100%"
          style={{ objectFit: "cover" }}
        />
        {editImage ? (
          <Box sx={{ position: "absolute", right: 10, bottom: 10 }}>
            <Box sx={{ alignSelf: "flex-start" }}>
              <Box
                sx={{
                  display: "flex",

                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "var(--grayTitle)",
                    textTransform: "none",
                    color: "var(--grayTitle)",
                    backgroundColor: "white",
                    "&:hover": {
                      borderColor: "var(--grayTitle)",
                      textTransform: "none",
                      color: "var(--grayTitle)",
                      backgroundColor: "white",
                    },
                  }}
                  onClick={() => {
                    saveCoverImage();
                  }}
                >
                  Save Image
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "var(--grayTitle)",
                    textTransform: "none",
                    color: "var(--grayTitle)",
                    backgroundColor: "white",
                    "&:hover": {
                      borderColor: "var(--grayTitle)",
                      textTransform: "none",
                      color: "var(--grayTitle)",
                      backgroundColor: "white",
                    },
                  }}
                  onClick={() => {
                    saveCoverImage(oldImage);
                    setEditImage(false);
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <>
            <Button
              variant="outlined"
              sx={{
                position: "absolute",
                right: 10,
                bottom: 10,
                borderColor: "var(--grayTitle)",
                textTransform: "none",
                color: "var(--grayTitle)",
                backgroundColor: "white",
                "&:hover": {
                  borderColor: "var(--grayTitle)",
                  textTransform: "none",
                  color: "var(--grayTitle)",
                  backgroundColor: "white",
                },
              }}
            >
              <label
                htmlFor="cover-image"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                  <CameraAltIcon sx={{ color: "var(--grayTitle)" }} /> Change
                  Cover Image
                </Box>
              </label>
            </Button>
            <input
              id="cover-image"
              style={{ display: "none" }}
              type="file"
              name="images"
              accept="image/*"
              onChange={(event) => {
                setCoverImage(event.target.files[0]);
                setEditImage(true);
              }}
            />
          </>
        )}
      </Box>

      {/* Profile Image */}
      <Box
        sx={{
          position: "absolute",
          top: editProfile ? "9rem" : "7rem",
          left: "1rem",
          display: "flex",
        }}
      >
        {profileImage ? (
          <Avatar
            src={
              profileImage.name
                ? URL.createObjectURL(profileImage)
                : profileImage
            }
            sx={{
              height: "9rem",
              width: "9rem",
            }}
          ></Avatar>
        ) : (
          <Avatar
            sx={{
              height: "9rem",
              width: "9rem",
              fontSize: "5rem",
            }}
          >
            {name[0]}
          </Avatar>
        )}
      </Box>

      <IconButton
        sx={{
          position: "absolute",
          top: editProfile ? "14.8rem" : "13rem",
          left: "7.5rem",
        }}
      >
        <label
          htmlFor="profile-image"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Paper
            sx={{
              borderRadius: "3rem",
              padding: "0.3rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <CameraAltIcon sx={{ color: "var(--grayTitle)" }} />
          </Paper>
        </label>
      </IconButton>

      <input
        id="profile-image"
        style={{ display: "none" }}
        type="file"
        name="images"
        accept="image/*"
        onChange={(event) => {
          setProfileImage(event.target.files[0]);
        }}
      />

      {/* Profile Text */}

      {editProfile ? (
        <Box
          sx={{
            ml: "11rem",
            mt: "0.8rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Enter Name"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Enter Location"
              size="small"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Box>

          {/* Button */}
          <Box sx={{ alignSelf: "flex-start" }}>
            <Box
              sx={{
                display: "flex",

                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  borderColor: "var(--grayTitle)",
                  textTransform: "none",
                  color: "var(--grayTitle)",
                  "&:hover": {
                    borderColor: "var(--grayTitle)",
                    textTransform: "none",
                    color: "var(--grayTitle)",
                  },
                }}
                onClick={() => {
                  saveProfile();
                }}
              >
                Save Profile
              </Button>
              <Button
                variant="outlined"
                sx={{
                  mr: "1rem",
                  borderColor: "var(--grayTitle)",
                  textTransform: "none",
                  color: "var(--grayTitle)",
                  "&:hover": {
                    borderColor: "var(--grayTitle)",
                    textTransform: "none",
                    color: "var(--grayTitle)",
                  },
                }}
                onClick={() => {
                  setName(oldName);
                  setLocation(oldLocation);
                  setEditProfile(false);
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            ml: "11rem",
            mt: "0.8rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "1.6rem", fontWeight: 800 }}>
              {name}
            </Typography>
            <Typography sx={{ color: "var(--grayTitle)" }}>
              {location !== undefined
                ? location
                : "Edit profile to enter location"}
            </Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              sx={{
                mr: "2rem",
                borderColor: "var(--grayTitle)",
                textTransform: "none",
                color: "var(--grayTitle)",
                "&:hover": {
                  borderColor: "var(--grayTitle)",
                  textTransform: "none",
                  color: "var(--grayTitle)",
                },
              }}
              startIcon={
                <img
                  src={EditImage}
                  alt="loading"
                  style={{ width: "1.2rem" }}
                />
              }
              onClick={() => {
                setEditProfile(true);
              }}
            >
              Edit Profile
            </Button>
          </Box>
        </Box>
      )}

      {/* Tabs */}
      <Box sx={{ mt: "1rem", paddingX: "1rem" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={tabChange} aria-label="tabs">
            <Tab
              icon={<MailOutlineIcon />}
              iconPosition="start"
              label="Posts"
              value="1"
            />
            <Tab
              icon={<InfoIcon />}
              iconPosition="start"
              label="About"
              value="2"
            />
            <Tab
              icon={<PeopleIcon />}
              iconPosition="start"
              label="Following"
              value="3"
            />
            <Tab
              icon={<PhotoSizeSelectActualIcon />}
              iconPosition="start"
              label="Photos"
              value="4"
            />
          </Tabs>
        </Box>
      </Box>
    </Card>
  );
};

export default MyProfile;
