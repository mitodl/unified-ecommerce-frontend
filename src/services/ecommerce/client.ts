import { PaymentsApi, UsersApi } from "./generated/v0/api";
import axios from "axios";

const BASE_PATH = process.env.NEXT_PUBLIC_UE_API_BASE_URL;

const instance = axios.create({
  withCredentials: true,
});

const paymentsApi = new PaymentsApi(undefined, BASE_PATH, instance);

const usersApi = new UsersApi(undefined, BASE_PATH, instance);

export { paymentsApi, usersApi, BASE_PATH };
