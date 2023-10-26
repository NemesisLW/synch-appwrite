import { storage } from "@/appwrite";
import { getURL } from "next/dist/shared/lib/utils";

const getImageUrl = async (image: Image) => {
  const url = storage.getFilePreview(image.bucketId, image.fileId);

  return url;
};

export default getImageUrl;
