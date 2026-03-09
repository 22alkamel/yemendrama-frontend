import api from "@/lib/api";

export const getNews = async () => {
  return api.get("/news");
};

export const getNewsById = async (uuid: string) => {
  return api.get(`/news/${uuid}`);
};

export const createNews = (data: FormData) =>
  api.post("/news", data);

export const updateNews = (uuid: string, data: FormData) =>
  api.post(`/news/${uuid}?_method=PUT`, data);

export const deleteNews = async (uuid: string) => {
  return api.delete(`/news/${uuid}`);
};

export const toggleNewsPublish = (uuid: string) =>
  api.patch(`/news/${uuid}/publish`);



export const getSingleNews = (uuid: string) => {
  return api.get(`/news/${uuid}`);
};