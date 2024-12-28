"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi({});

export const deleteUploadthingFiles = async (keys: string[]) => {
  try {
    await utapi.deleteFiles(keys);
  } catch (error) {
    console.error("Error: ", error);
  }
};
