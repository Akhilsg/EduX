import axios from "axios";

const UPLOAD_URL = "http://localhost:8080/api/upload";

export const uploadPDFAndExtractText = async (file, onUploadProgress) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${UPLOAD_URL}/extract-text`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
    console.log(response);

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("Error uploading file");
    }
  }
};
