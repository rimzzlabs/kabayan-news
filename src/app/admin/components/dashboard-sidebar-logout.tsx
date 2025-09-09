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
import { LogOut } from "lucide-react";
import { withSonnerPromise } from "@/lib/sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSignout } from "@/modules/auth/hooks";

export function DashboardSidebarLogout() {
  let router = useRouter();
  let logout = useSignout();
  let qc = useQueryClient();
  let [isPending, startTransition] = useTransition();

  let onClick = withSonnerPromise(
    async () => {
      await logout.mutateAsync();
      qc.clear();
      qc.getMutationCache().clear();
      startTransition(() => {
        router.replace("/auth/signin");
      });
    },
    { loading: "Memuat...", success: "Berhasil logout", error: "Gagal logout" },
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={logout.isPending || isPending} variant="outline">
          <LogOut className="size-4" />
          Logout
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Informasi</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah anda yakin ingin logout?
          </AlertDialogDescription>

          <AlertDialogFooter>
            <AlertDialogCancel>Batalkan</AlertDialogCancel>
            <AlertDialogAction onClick={onClick}>Ya, Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
