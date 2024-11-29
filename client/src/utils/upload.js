import { generateUploadButton } from "@uploadthing/react";
import routes from "../constants/routes";
export const UploadButton = generateUploadButton({
  url: routes.upload.uploadImage,
});