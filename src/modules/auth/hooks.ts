import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "./browser-query";
import { createClient } from "../supabase/client";
import type { SignInSchema } from "./zod-schema";
import { signinAction, signOutAction } from "./actions";

let client = createClient();

export function useUser() {
  return useQuery({
    queryKey: ["get-user"],
    queryFn: async () => await getUser(client),
  });
}

export function useSignIn() {
  let qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SignInSchema) => {
      let res = await signinAction(payload);
      if (res.error) throw new Error(res.message);

      return res.result;
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: ["get-user"] });
    },
  });
}

export function useSignout() {
  let qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      let res = await signOutAction();
      if (res.error) throw new Error(res.message);

      return res.result;
    },
    onSettled: () => qc.clear(),
  });
}
