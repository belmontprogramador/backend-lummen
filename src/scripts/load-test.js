import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 200,        // usuários simultâneos
  duration: "30s", // tempo total
};

export default function () {
  http.get("https://SEU_BACKEND/feed");
  sleep(1);
}
