import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { getApi, postApi } from "../API";

const Social = () => {
  const [postContent, setPostContent] = useState("");
  const [data, setData] = useState([]);
  useEffect(() => {
    getApi("/social/get").then((res) => {
      setData(res.data);
    });
  }, []);

  // Handle the Share button click
  const handleShare = async () => {
    try {
      await postApi("/social/add", {
        content: postContent,
      });
      window.location.reload();
    } catch (error) {
      alert(error.response.data);
    }
  };

  return (
    <div className="flex justify-center gap-4 p-4">
      <div className="flex-1">
        {data.map((doc, i) => (
          <Box
            key={i}
            className="w-full max-w-lg p-4 mb-6 text-black bg-green-100 rounded-lg"
            boxShadow={3}
          >
            <Typography variant="h6" className="mb-2 font-bold">
              {doc.name}
            </Typography>
            <Typography className="mb-4 text-sm">{doc.content}</Typography>
            <Typography className="text-xs text-gray-500">
              {new Date(doc.created_at).toDateString()}
            </Typography>
          </Box>
        ))}
      </div>

      {/* New Post Section */}
      <Box className="w-full max-w-lg space-y-2">
        <Typography className="">New Post</Typography>
        <TextField
          label="Content"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
        <Button
          className=""
          variant="contained"
          onClick={handleShare}
          sx={{
            backgroundColor: "#07C236",
            "&:hover": {
              backgroundColor: "#06A32F",
            },
          }}
        >
          Share
        </Button>
      </Box>
    </div>
  );
};

export default Social;
