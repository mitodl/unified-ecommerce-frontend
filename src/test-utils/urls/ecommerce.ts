/**
 * This file exists because OpenAPI Generator doesn't expose the urls directly,
 * which we need when mocking axios.
 */

const BASE_URL = process.env.NEXT_PUBLIC_UE_API_BASE_URL;

const userMe = {
  get: () => `${BASE_URL}/api/v0/users/me/`,
};

export { userMe };
