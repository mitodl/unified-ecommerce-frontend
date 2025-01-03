"use client";

const getCurrentSystem = (urlParams: URLSearchParams) => {
  let system: string = "";

  if (urlParams.has("mitxonline")) {
    system = "mitxonline";
  }

  if (urlParams.has("mitxpro")) {
    system = "mitxpro";
  }

  if (urlParams.has("system")) {
    system = encodeURIComponent(urlParams.get("system") as string);
  }

  return system;
};

const getCurrentStatus = (urlParams: URLSearchParams) => {
  let status: string = "";

  if (urlParams.has("fulfilled")) {
    status = "fulfilled";
  }

  if (urlParams.has("pending")) {
    status = "pending";
  }

  if (urlParams.has("status")) {
    status = encodeURIComponent(urlParams.get("status") as string);
  }

  return status;
};

export { getCurrentSystem, getCurrentStatus };
