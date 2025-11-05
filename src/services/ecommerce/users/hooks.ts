import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../client";

const users = {
  me: {
    queryKey: ["users", "me"],
    queryFn: async () => {
      const response = await usersApi.commerceApiV0UsersMeRetrieve();
      return response.data;
    },
  },
};

const useUsersMe = () => {
  return useQuery({ ...users.me });
};

export { useUsersMe };
