import * as matchers from "jest-extended";
import failOnConsole from "jest-fail-on-console";
import { mockAxiosInstance } from "./test-utils/mockAxios";
import { resetAllWhenMocks } from "jest-when";

expect.extend(matchers);
failOnConsole();

jest.mock("axios", () => {
  const AxiosError = jest.requireActual("axios").AxiosError;
  return {
    __esModule: true,
    default: {
      create: () => mockAxiosInstance,
      AxiosError,
    },
    AxiosError,
  };
});

afterEach(() => {
  /**
   * Clear all mock call counts between tests.
   * This does NOT clear mock implementations.
   * Mock implementations are always cleared between test files.
   */
  jest.clearAllMocks();
  resetAllWhenMocks();
  window.history.replaceState({}, "", "/");
});

process.env.NEXT_PUBLIC_UE_API_BASE_URL = "http://ue.test.local:9080";
