import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAspirationCategories, getAspirations } from "./browser-query";
import { createClient } from "../supabase/client";
import { createAspirationAction, removeAspirationAction } from "./actions";
import type { CreateAspirationSchema } from "./zod-schema";

let client = createClient();

export function useAspirations(
  options?: OptionalPagination & { userId?: string },
) {
  return useQuery({
    queryKey: [
      "get-aspirations",
      options?.userId,
      options?.page,
      options?.limit,
    ] as const,
    queryFn: async (ctx) => {
      let [, userId, page, limit] = ctx.queryKey;
      let res = await getAspirations(client, {
        page,
        limit,
        userId,
        signal: ctx.signal,
      });
      return res;
    },
  });
}

export function useAspirationCategories(options?: OptionalPagination) {
  return useQuery({
    queryKey: [
      "get-aspiration-categories",
      options?.page,
      options?.limit,
    ] as const,
    queryFn: async (ctx) => {
      let [, page, limit] = ctx.queryKey;

      let res = await getAspirationCategories(client, {
        page,
        limit,
        signal: ctx.signal,
      });
      return res.data;
    },
  });
}

export function useCreateAspiration() {
  let qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAspirationSchema) => {
      let res = await createAspirationAction(payload);
      if (res.error) throw new Error(res.message);

      return res.result;
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: ["get-aspirations"] });
    },
  });
}

export function useRemoveAspiration() {
  let qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { aspirationId: string }) => {
      let res = await removeAspirationAction(payload);
      if (res.error) throw new Error(res.message);

      return res.result;
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: ["get-aspirations"] });
    },
  });
}
