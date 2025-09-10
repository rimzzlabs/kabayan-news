import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getAspirationCategories, getAspirations } from "./browser-query";
import { createClient } from "../supabase/client";
import {
  createAspirationAction,
  removeAspirationAction,
  updateAspirationAction,
} from "./actions";
import type {
  CreateAspirationSchema,
  UpdateAspirationSchema,
} from "./zod-schema";
import { parseAsInteger, useQueryState } from "nuqs";

let client = createClient();

type InfiniteAspirationsInitialData = {
  result: Array<Aspiration>;
  count: number;
  page: number;
  limit: number;
};

export function useAspirations(
  options?: OptionalPagination & {
    userId?: string;
    initialData?: { count: number; result: Array<Aspiration> };
  },
) {
  return useQuery({
    initialData: options?.initialData,
    queryKey: [
      "get-aspirations",
      options?.userId ?? null,
      options?.page,
      options?.limit,
    ] as const,
    queryFn: async (ctx) => {
      let [, userId, page, limit] = ctx.queryKey;
      let res = await getAspirations(client, {
        page,
        limit,
        signal: ctx.signal,
        throwOnError: true,
        userId: userId ?? undefined,
      });
      return { count: res.count, result: res.data };
    },
  });
}

export function useInfiniteAspirations(
  initialData?: InfiniteAspirationsInitialData,
) {
  let [limit] = useQueryState("limit", parseAsInteger.withDefault(10));

  return useInfiniteQuery({
    initialData: initialData
      ? {
          pages: [
            {
              result: initialData.result,
              limit: initialData.limit,
              total: initialData.count,
              page: initialData.page,
            },
          ],
          pageParams: [],
        }
      : undefined,
    queryKey: ["get-infinite-aspirations", limit] as const,
    queryFn: async (ctx) => {
      let [, limit] = ctx.queryKey;

      let res = await getAspirations(client, {
        limit,
        page: ctx.pageParam,
        signal: ctx.signal,
      });
      return {
        result: res.data ?? [],
        total: res.count ?? 0,
        page: ctx.pageParam,
        limit,
      };
    },
    initialPageParam: 0,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => {
      let { page, total, limit } = lastPage;
      let loaded = (page + 1) * limit;
      return loaded < total ? page + 1 : undefined;
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

export function useUpdateAspiration() {
  let qc = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: Partial<Omit<UpdateAspirationSchema, "id">> & { id: string },
    ) => {
      let res = await updateAspirationAction(payload);
      if (res.error) throw new Error(res.message);

      return res.result;
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: ["get-aspirations"] });
    },
  });
}
