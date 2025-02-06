import React, { useState } from "react";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { updateProfileDescription } from "../reactQuery/mutation";
import { stringSplit } from "../utils/helper";

const AboutMe = ({ description }) => {
  const auth = useSelector((state) => state.auth.user);
  const [edit, setEdit] = useState(false);
  const [descriptionField, setDescriptionField] = useState(description);
  const [oldDescriptionField, setOldDescriptionField] = useState(description);

  const saveDescriptionMutation = useMutation(updateProfileDescription, {
    onSuccess: (data) => {
      setEdit(false);
      setOldDescriptionField(descriptionField);
      setDescriptionField(data.response.data.description);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const saveDescription = () => {
    saveDescriptionMutation.mutate({
      email: auth.email,
      description: descriptionField,
      name: auth.name,
    });
  };

  return (
    <Card sx={{ padding: "1rem" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ fontSize: "2rem", fontWeight: 500 }}>
          About me
        </Typography>
        {!edit && (
          <EditIcon
            sx={{ fontSize: "1.5rem", ml: "2rem", cursor: "pointer" }}
            onClick={() => setEdit(true)}
          />
        )}
      </Box>
      {edit ? (
        <Box sx={{ mt: "1rem" }}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Enter Description"
            size="small"
            value={descriptionField}
            onChange={(e) => setDescriptionField(e.target.value)}
            multiline
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: "2rem",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                borderColor: "var(--grayTitle)",
                textTransform: "none",
                color: "var(--grayTitle)",
                "&:hover": {
                  textTransform: "none",
                  color: "white",
                  bgcolor: "var(--blue)",
                },
              }}
              onClick={saveDescription}
              disabled={saveDescriptionMutation.isLoading}
            >
              Save
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
                setDescriptionField(oldDescriptionField);
                setEdit(false);
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          {descriptionField ? (
            stringSplit(descriptionField).map((item, index) => {
              return (
                <Typography
                  key={index}
                  sx={{
                    fontSize: "0.9rem",
                    color: "var(--grayTitle)",
                    mb: "0.5rem",
                  }}
                >
                  {item}
                </Typography>
              );
            })
          ) : (
            <Typography sx={{ mt: "1rem" }}>
              Please edit the description
            </Typography>
          )}
        </>
      )}
    </Card>
  );
};

export default AboutMe;
