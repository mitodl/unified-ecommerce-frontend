import { getCurrentSystem } from "./system";

describe("getCurrentSystem", () => {
    test("Returns one of the expected systems", () => {
        const urlParams = new URLSearchParams();
        urlParams.set("mitxonline", "true");
        expect(getCurrentSystem(urlParams)).toBe("mitxonline");

        urlParams.set("mitxpro", "");
        expect(getCurrentSystem(urlParams)).toBe("mitxpro");

        urlParams.set("system", "mitxpro");
        expect(getCurrentSystem(urlParams)).toBe("mitxpro");
    });

    test("Returns one of the expected systems when the URL has multiple query params", () => {
        const urlParams = new URLSearchParams();
        urlParams.set("cat", "meow");
        urlParams.set("dog", "woof");
        urlParams.set("mitxonline", "");
        expect(getCurrentSystem(urlParams)).toBe("mitxonline");
    });
});
