"use client";

import { TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useUser } from "@/modules/auth/hooks";
import { useIsClient } from "@/hooks/use-is-client";
import { Skeleton } from "./ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useRemoveAspiration } from "@/modules/aspiration/hooks";
import { withSonnerPromise } from "@/lib/sonner";

export function ArticleAspirationCardRemove(props: Aspiration) {
  let userQuery = useUser();
  let isClient = useIsClient();
  let removeAspiration = useRemoveAspiration();

  let userId = userQuery.data?.id;

  if (!isClient || userQuery.isPending || userQuery.isError) {
    return <Skeleton className="size-8 ml-auto" />;
  }

  let onRemove = withSonnerPromise(
    async () => {
      await removeAspiration.mutateAsync({ aspirationId: props.id });
    },
    {
      loading: "Menghapus aspirasi",
      success: "Aspirasi berhasil dihapus",
      error: "Gagal menghapus aspirasi, harap coba lagi nanti",
    },
  );

  if (props.user_id !== userId) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className="size-8 ml-auto"
          disabled={removeAspiration.isPending}
        >
          <span className="sr-only">Hapus aspirasi</span>
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus aspirasi?</AlertDialogTitle>
          <AlertDialogDescription>
            Anda yakin ingin menghapus aspirasi ini? Aspirasi ini merupakan
            salah satu aspirasi yang pernah anda buat
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Tidak, batalkan</AlertDialogCancel>
          <Button variant="destructive" asChild>
            <AlertDialogAction onClick={onRemove}>Ya, Hapus</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
