import { api } from "./client";

export type Tag = {
  id: number;
  name: string;
};

export type Item = {
  id: number;
  title: string;
  content: string;
  tag_names: string;
  tags: Tag[];
  created_at: string;
  updated_at: string;
};

export type ItemParams = {
  title: string;
  content: string;
  tag_names: string;
};

export const itemsApi = {
  index: (params?: { tag?: string | string[] }) => {
    const query = params?.tag
      ? "?" +
        [params.tag]
          .flat()
          .map((t) => `tag[]=${encodeURIComponent(t)}`)
          .join("&")
      : "";
    return api.get<Item[]>(`/api/v1/items${query}`);
  },
  show: (id: number) => api.get<Item>(`/api/v1/items/${id}`),
  create: (params: ItemParams) =>
    api.post<Item>("/api/v1/items", { item: params }),
  update: (id: number, params: Partial<ItemParams>) =>
    api.patch<Item>(`/api/v1/items/${id}`, { item: params }),
  delete: (id: number) => api.delete<void>(`/api/v1/items/${id}`),
};
