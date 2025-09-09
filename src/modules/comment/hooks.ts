import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createClient } from "../supabase/client";
import { getComments } from "./browser-query";
import type { CreateCommentSchema } from "./zod-schema";
import { createCommentAction } from "./actions";
import { toInt } from "radash";

type UseCommentsOptions = {
  newsId: string;
} & Partial<Pagination>;

type UseInfiniteCommentsOptions = (
  | { type: "berita"; newsId: string }
  | { type: "aspirasi"; aspirationId: string }
) &
  OptionalPagination;

let client = createClient();

export function useComments(options: UseCommentsOptions) {
  return useQuery({
    queryKey: [
      "get-comments",
      options.newsId,
      options.page,
      options.limit,
    ] as const,
    queryFn: async (ctx) => {
      let [, newsId, page, limit] = ctx.queryKey;

      let res = await getComments(client, { newsId, page, limit });
      return res.data;
    },
  });
}

export function useInfiniteComments(options: UseInfiniteCommentsOptions) {
  let limit = toInt(options.limit, 5);

  return useInfiniteQuery({
    queryKey: [
      "get-infinite-comments",
      // @ts-expect-error for query key, both are safe we just had to use null coalescing
      options.newsId,
      // @ts-expect-error for query key, both are safe we just had to use null coalescing
      options.aspirationId,
      limit,
    ] as const,
    queryFn: async (ctx) => {
      let [, newsId, aspirationId, limit] = ctx.queryKey;

      let res = await getComments(client, {
        limit,
        newsId,
        aspirationId,
        page: ctx.pageParam + 1,
        throwOnError: true,
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
    getNextPageParam: (lastPage) => {
      let { page, total, limit } = lastPage;
      let loaded = (page + 1) * limit;
      return loaded < total ? page + 1 : undefined;
    },
  });
}

export function useCreateComment() {
  let qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCommentSchema) => {
      let res = await createCommentAction(payload);
      if (res.error) throw new Error(res.message);

      return res.result;
    },
    onSettled: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["get-comments"] }),
        qc.invalidateQueries({ queryKey: ["get-infinite-comments"] }),
      ]);
    },
  });
}
