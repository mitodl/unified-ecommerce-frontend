import * as urls from "@/test-utils/urls/ecommerce";
import { setMockResponse, renderWithProviders } from "@/test-utils";
import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import EnsureSession from "./EnsureSession";

describe("EnsureSession", () => {
  const originalLocation = window.location;
  beforeEach(() => {
    // @ts-expect-error Location isn't optional, but we're about to re-assign it.
    delete window.location;
    window.location = { ...originalLocation, assign: jest.fn() };
  });
  afterEach(() => {
    window.location = originalLocation;
  });

  test("Authentiated users do not get redirected", async () => {
    setMockResponse.get(urls.userMe.get(), { id: 1 });
    renderWithProviders(<EnsureSession />);
    const progressBar = screen.getByRole("progressbar", { hidden: true });
    await waitForElementToBeRemoved(progressBar);

    expect(location.assign).not.toHaveBeenCalled();
  });

  test("Unauthentiated users are redirected", async () => {
    window.location = {
      ...window.location,
      search: "?system=test-system&cat=meow&dog=woof",
      href: "http://test.local:3000/?system=test-system&cat=meow&dog=woof"
    };

    setMockResponse.get(urls.userMe.get(), { id: null });

    expect(window.location.search).toBe("?system=test-system&cat=meow&dog=woof");

    renderWithProviders(<EnsureSession />);

    const mockAssign = jest.mocked(window.location.assign);
    await waitFor(() => {
      expect(mockAssign).toHaveBeenCalled();
    });

    const url = new URL(mockAssign.mock.calls[0][0]);
    console.log(mockAssign.mock.calls[0]);
    const expectedNext = encodeURIComponent("test-system");
    const expectedHref = `${process.env.NEXT_PUBLIC_UE_API_BASE_URL}/establish_session/?next=${expectedNext}`;
    expect(url.href).toBe(expectedHref);
  });
});
