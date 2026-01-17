import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "10s",
};

export default function () {
  const payload = JSON.stringify({
    email: "stress",
    password: "stress",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(
    "http://localhost:5000/api/auth/login",
    payload,
    params
  );

  check(res, {
    "status is 200 (login ok)": (r) => r.status === 200,
  });

  sleep(1);
}
