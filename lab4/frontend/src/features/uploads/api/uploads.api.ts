// src/features/uploads/api/uploads.api.ts

import { api } from "@/core/api/axios";
import type { UploadedFile, RenamePayload } from "../model/upload.types";

export const UploadsApi = {
  async uploadFile(file: File): Promise<UploadedFile> {
    const form = new FormData();
    form.append("file", file);

    const { data } = await api.post("/api/upload/file", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  },

  async getFiles(): Promise<UploadedFile[]> {
    const { data } = await api.get("/api/upload");
    return data.files || [];
  },

  async deleteFile(name: string) {
    const { data } = await api.delete(`/api/upload/${name}`);
    return data;
  },

  async renameFile(payload: RenamePayload) {
    const { data } = await api.put("/api/upload/rename", payload);
    return data;
  },
};
