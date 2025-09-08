"use client";

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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { withSonnerPromise } from "@/lib/sonner";
import { useSignout } from "@/modules/auth/hooks";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LayoutHeaderProfileLogout() {
  let signout = useSignout();
  let router = useRouter();
  let [isPending, startTransition] = useTransition();

  let disableButton = isPending || signout.isPending;

  let onClick = withSonnerPromise(
    async () => {
      await signout.mutateAsync();
      startTransition(() => {
        router.push("/auth/signin");
      });
    },
    {
      loading: "Mengakhiri sesi",
      success: "Logout berhasil",
      error: "Gagal logout, harap coba lagi nanti",
    },
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-full"
          disabled={disableButton}
        >
          <LogOutIcon />
          Logout
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Yakin Logout?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah anda yakin ingin logout dan mengakhiri sesi?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Batalkan</AlertDialogCancel>
          <Button asChild variant="destructive">
            <AlertDialogAction onClick={onClick}>Ya, Logout</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
