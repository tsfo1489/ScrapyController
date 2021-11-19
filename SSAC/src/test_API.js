import API from "./API.js";

let response = await API.post("/create/", {
  name: "temp2",
  crawlers: [
    {
      type: "News",
      newspaperId: 4,
      parameters: {
        begin_date: "20180101",
        end_date: "20210630",
        keywords: ["K-pop", "BTS", "Exo"],
      },
    },
  ],
});

console.log(response.data);
