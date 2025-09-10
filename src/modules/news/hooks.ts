import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";
import { getNews, getNewsCategories } from "./browser-query";
import { createClient } from "../supabase/client";
import {
  createNewsAction,
  removeNewsAction,
  updateNewsAction,
} from "./actions";
import type { CreateNewsSchema, UpdateNewsSchema } from "./zod-schema";

let client = createClient();

type InfiniteNewsInitialData = {
  result: Array<News>;
  count: number;
  page: number;
  limit: number;
};

export function useInfiniteNews(initialData?: InfiniteNewsInitialData) {
  let [limit] = useQueryState("limit", parseAsInteger.withDefault(10));

  return useInfiniteQuery({
    staleTime: Infinity,
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
    queryKey: ["get-infinite-news", limit] as const,
    queryFn: async (ctx) => {
      let [, limit] = ctx.queryKey;

      let res = await getNews(client, {
        limit,
        page: ctx.pageParam,
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

export function useNews(
  options?: OptionalPagination & {
    status?: "draft" | "published";
    initialData?: { count: number; result: Array<News> };
  },
) {
  return useQuery({
    initialData: options?.initialData,
    queryKey: [
      "get-news",
      options?.status,
      options?.page,
      options?.limit,
    ] as const,
    queryFn: async (ctx) => {
      let [, status, page, limit] = ctx.queryKey;

      let res = await getNews(client, {
        status,
        page,
        limit,
        signal: ctx.signal,
        throwOnError: true,
      });

      return { count: res.count, result: res.data };
    },
  });
}

export function useRemoveNews() {
  let qc = useQueryClient();

  return useMutation({
    mutationFn: async (newsId: string) => {
      let res = await removeNewsAction(newsId);
      if (res.error) throw new Error(res.message);

      return res.result;
    },
    onSettled: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["get-news"] }),
        qc.invalidateQueries({ queryKey: ["get-infinite-news"] }),
      ]);
    },
  });
}

export function useNewsCategories(options?: OptionalPagination) {
  return useQuery({
    queryKey: ["get-news-categories", options?.page, options?.limit] as const,
    queryFn: async (ctx) => {
      let [, page, limit] = ctx.queryKey;

      let res = await getNewsCategories(client, {
        page,
        limit,
        signal: ctx.signal,
      });
      return res.data;
    },
  });
}

export function useCreateNews() {
  let qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateNewsSchema) => {
      let res = await createNewsAction(payload);
      if (res.error) throw new Error(res.message);

      return res.result;
    },
    onSettled: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["get-news"] }),
        qc.invalidateQueries({ queryKey: ["get-infinite-news"] }),
      ]);
    },
  });
}

export function useUpdateNews() {
  let qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateNewsSchema) => {
      let res = await updateNewsAction(payload);
      if (res.error) throw new Error(res.message);

      return res.result;
    },
    onSettled: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["get-news"] }),
        qc.invalidateQueries({ queryKey: ["get-infinite-news"] }),
      ]);
    },
  });
}

export function useUpdateNewsStatus() {
  let qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      id: string;
      status: "draft" | "published";
    }) => {
      let res = await updateNewsAction({
        id: payload.id,
        status: payload.status,
      });
      if (res.error) throw new Error(res.message);

      return res.result;
    },
    onSettled: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["get-news"] }),
        qc.invalidateQueries({ queryKey: ["get-infinite-news"] }),
      ]);
    },
  });
}
