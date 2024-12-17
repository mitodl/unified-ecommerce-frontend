import invariant from "tiny-invariant";
import { PaymentsApi, UsersApi, MetaApi } from "./generated/v0/api";
import axios from "axios";

const BASE_PATH = process.env.NEXT_PUBLIC_UE_API_BASE_URL;
invariant(BASE_PATH, "NEXT_PUBLIC_UE_API_BASE_URL is required.");

const instance = axios.create({
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFTOKEN",
});

const paymentsApi = new PaymentsApi(undefined, BASE_PATH, instance);

const usersApi = new UsersApi(undefined, BASE_PATH, instance);

const metaApi = new MetaApi(undefined, BASE_PATH, instance);

const devSameSiteCheck = () => {
  if (process.env.NODE_ENV === "development") {
    const getSite = (hostname: string) => {
      /**
       * For same-site cookies to be sent, the origin and the cookie's domain
       * must be on the same site. Usually that's the top-level domain plus one
       * more subdomain, e.g., `foo.com` or `mit.edu`.
       *
       * That's what this function returns: TLD+1. This is heuristic, since
       * it ignores the public suffix list, but it's good enough for our
       * purposes of dev environment warnings.
       */
      return hostname.split(".").slice(-2).join(".");
    };
    const clientHostname = getSite(window.location.hostname);
    const apiHostname = getSite(new URL(BASE_PATH).hostname);
    if (clientHostname !== apiHostname) {
      const message = [
        "The API and client need to be hosted on the same site,",
        "otherwise same-site authentication cookies won't work.",
        "For example, use ue.odl.local and uefe.odl.local.",
        "This is a development-only error.",
      ].join(" ");
      throw new Error(message);
    }
  }
};

export { paymentsApi, usersApi, metaApi, BASE_PATH, devSameSiteCheck };
