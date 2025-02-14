import http from "../libs/http";

export default {
  all: (data) => http.post("api/edit/statistics/all/list", data),
  day: (data) => http.post("api/edit/statistics/day/list", data),
  dayExport: (data) =>
    http.post("api/staff/statistics/day/export", data, {
      format: false,
      responseType: "blob",
    }),
  list: (data) => http.post("api/staff/statistics/list", data),
  export: (data) =>
    http.post("api/staff/statistics/list/export", data, {
      format: false,
      responseType: "blob",
    }),
  order: (data) => http.post("api/edit/order/list", data),
};
