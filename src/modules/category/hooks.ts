import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getCategories } from "./browser-query";
import { createClient } from "../supabase/client";
import type { Tables } from "../supabase/types";
import {
  createCategoryAction,
  removeCategoryAction,
  updateCategoryAction,
} from "./actions";
import type { CreateCategorySchema, UpdateCategorySchema } from "./zod-schema";

let client = createClient();

type UseCategoriesOptions = OptionalPagination & {
  type?: "berita" | "aspirasi";
  initialData?: { result: Array<Tables<"kategori">>; count: number };
};

export function useCategories(options?: UseCategoriesOptions) {
  return useQuery({
    initialData: options?.initialData,
    placeholderData: keepPreviousData,
    queryKey: [
      "get-categories",
      options?.type ?? null,
      options?.page ?? 1,
      options?.limit ?? 10,
    ] as const,
    queryFn: async (ctx) => {
      let [, type, page, limit] = ctx.queryKey;

      let res = await getCategories(client, {
        page,
        limit,
        throwOnError: true,
        signal: ctx.signal,
        type: type ?? undefined,
      });
      return { result: res.data ?? [], count: res.count ?? 0 };
    },
  });
}

export function useCreateCategory() {
  let qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCategorySchema) => {
      let res = await createCategoryAction(payload);
      if (res.error) throw new Error(res.message);

      return res.result;
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: ["get-categories"] });
    },
  });
}

export function useUpdateCategory() {
  let qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateCategorySchema) => {
      let res = await updateCategoryAction(payload);
      if (res.error) throw new Error(res.message);

      return res.result;
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: ["get-categories"] });
    },
  });
}

export function useRemoveCategory() {
  let qc = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      let res = await removeCategoryAction(categoryId);
      if (res.error) throw new Error(res.message);

      return res.result;
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: ["get-categories"] });
    },
  });
}
