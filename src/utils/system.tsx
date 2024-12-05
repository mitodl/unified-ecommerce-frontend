const getCurrentSystem = () => {
  const urlparams = new URLSearchParams(window.location.search);
  let system: string = "";

  if (urlparams.has("mitxonline")) {
    system = "mitxonline";
  }

  if (urlparams.has("mitxpro")) {
    system = "mitxpro";
  }

  if (urlparams.has("system")) {
    system = encodeURIComponent(urlparams.get("system") as string);
  }

  return system;
};

export { getCurrentSystem };
