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

export { getCurrentSystem };
