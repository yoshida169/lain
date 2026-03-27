import { api } from "client";

export type Tag = {
  id: number;
  name: string;
};

export const tagsApi = {
  index: () => api.get<Tag[]>("/api/v1/tags"),
};
