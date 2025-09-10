"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { preventDefault } from "@/lib/event";
import { withSonnerPromise, type WithSonnerPromiseOptions } from "@/lib/sonner";
import {
  useRemoveAspiration,
  useUpdateAspiration,
} from "@/modules/aspiration/hooks";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import {
  CheckCircle2Icon,
  CheckIcon,
  EyeIcon,
  HourglassIcon,
  MoreVerticalIcon,
  TrashIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";

export function AspirationTableColumnAction(props: Aspiration) {
  let [open, setOpen] = useState(false);
  let updateAspiration = useUpdateAspiration();
  let removeAspiration = useRemoveAspiration();

  let onUpdateStatus = (
    status: "dikirim" | "diverifikasi" | "diproses" | "ditolak" | "selesai",
    options: WithSonnerPromiseOptions,
  ) => {
    return withSonnerPromise(async () => {
      setOpen(false);
      await updateAspiration.mutateAsync({
        id: props.id,
        status,
      });
    }, options);
  };

  let onClickRemove = withSonnerPromise(
    async () => {
      setOpen(false);
      await removeAspiration.mutateAsync({
        aspirationId: props.id,
      });
    },
    {
      loading: "Menghapus aspirasi",
      success: "Aspirasi berhasil dihapus",
      error: "Gagal menghapus aspirasi, harap coba lagi nanti",
    },
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={updateAspiration.isPending}>
          <span className="sr-only">Menu</span>
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a target="_blank" rel="noopener" href={`/aspiration/${props.slug}`}>
            <EyeIcon />
            Lihat
          </a>
        </DropdownMenuItem>

        {props.status === "dikirim" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={preventDefault}>
                <CheckCircle2Icon />
                Verifikasi Aspirasi
              </DropdownMenuItem>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Apakah kamu yakin ingin memverifikasi aspirasi ini?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Kamu akan memverifikasi aspirasi ini, dan tidak bisa
                  dikembalikan lagi, tetapi kamu bisa menolak aspirasi ini jika
                  kamu ingin.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batalkan</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onUpdateStatus("diverifikasi", {
                    loading: "Memverifikasi aspirasi",
                    success: "Aspirasi berhasil diverifikasi",
                    error:
                      "Gagal memverifikasi aspirasi, harap coba lagi nanti",
                  })}
                >
                  Ya, verifikasi aspirasi
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {props.status === "diverifikasi" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={preventDefault}>
                <HourglassIcon />
                Proses Aspirasi
              </DropdownMenuItem>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Apakah kamu yakin ingin memproses aspirasi ini?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Kamu akan memproses aspirasi ini, dan tidak bisa dikembalikan
                  lagi, tetapi kamu bisa menolak aspirasi ini jika kamu ingin.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batalkan</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onUpdateStatus("diproses", {
                    loading: "Memperbarui status aspirasi",
                    success: "Status Aspirasi berhasil diperbarui",
                    error:
                      "Gagal memperbarui status aspirasi, harap coba lagi nanti",
                  })}
                >
                  Ya, proses aspirasi
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {props.status === "diproses" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={preventDefault}>
                <CheckIcon />
                Tandai Selesai
              </DropdownMenuItem>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Apakah kamu yakin ingin menyelesaikan aspirasi ini?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Kamu akan menyelesaikan aspirasi ini, dan tidak bisa
                  dikembalikan lagi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batalkan</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onUpdateStatus("selesai", {
                    loading: "Memperbarui status aspirasi",
                    success: "Status Aspirasi berhasil diperbarui",
                    error:
                      "Gagal memperbarui status aspirasi, harap coba lagi nanti",
                  })}
                >
                  Ya, tandai selesai
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {props.status !== "selesai" && props.status !== "ditolak" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={preventDefault}>
                <XCircleIcon />
                Tolak Aspirasi
              </DropdownMenuItem>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Apakah kamu yakin ingin menolak aspirasi ini?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Kamu akan menolak aspirasi ini, dan tidak bisa dikembalikan
                  lagi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batalkan</AlertDialogCancel>
                <Button variant="destructive" asChild>
                  <AlertDialogAction
                    onClick={onUpdateStatus("ditolak", {
                      loading: "Menolak aspirasi",
                      success: "Aspirasi berhasil ditolak",
                      error: "Gagal menolak aspirasi, harap coba lagi nanti",
                    })}
                  >
                    Ya, tolak aspirasi
                  </AlertDialogAction>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <DropdownMenuSeparator />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={preventDefault}>
              <TrashIcon />
              Hapus
            </DropdownMenuItem>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Apakah kamu yakin ingin menghapus aspirasi ini?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Kamu akan menghapus aspirasi ini, dan tidak bisa dikembalikan
                lagi.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Batalkan</AlertDialogCancel>

              <Button variant="destructive" asChild>
                <AlertDialogAction onClick={onClickRemove}>
                  Ya, hapus aspirasi
                </AlertDialogAction>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
