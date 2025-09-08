import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../supabase/client";
import { getComments } from "./browser-query";
import type { CreateCommentSchema } from "./zod-schema";
import { createCommentAction } from "./actions";

type UseCommentsOptions = {
  newsId: string;
} & Partial<Pagination>;

let client = createClient();

export function useComments(options: UseCommentsOptions) {
  return useQuery({
    queryKey: [
      "get-comments",
      options.newsId,
      options.page,
      options.limit,
    ] as const,
    queryFn: (ctx) => {
      let [, newsId, page, limit] = ctx.queryKey;

      return getComments(client, { newsId, page, limit });
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
      await qc.invalidateQueries({ queryKey: ["get-comments"] });
    },
  });
}
