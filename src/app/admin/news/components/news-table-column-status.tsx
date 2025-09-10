"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { withSonnerPromise } from "@/lib/sonner";
import { useUpdateNewsStatus } from "@/modules/news/hooks";
import { CheckIcon, ChevronDown, Loader } from "lucide-react";

let items = [
  { name: "Published", value: "published" },
  { name: "Draft", value: "draft" },
] as const;

export function NewsTableColumnStatus(props: News) {
  let updateStatus = useUpdateNewsStatus();

  let onUpdateStatus = (nextValue: "published" | "draft") =>
    withSonnerPromise(
      async () => {
        if (nextValue === props.status) return;

        await updateStatus.mutateAsync({
          id: props.id,
          status: nextValue,
        });
      },
      {
        loading: "Mengubah status...",
        success: "Status berhasil diubah",
        error: "Gagal mengubah status, harap coba lagi nanti",
      },
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={updateStatus.isPending}>
          {updateStatus.isPending && <Loader className="animate-spin" />}
          <ChevronDown /> {props.status === "draft" ? "Draft" : "Dipublikasi"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={onUpdateStatus(item.value)}
            disabled={item.value === props.status}
          >
            {item.name}{" "}
            {item.value === props.status && (
              <CheckIcon className="size-3 ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
