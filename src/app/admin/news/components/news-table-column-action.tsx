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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { preventDefault } from "@/lib/event";
import { withSonnerPromise } from "@/lib/sonner";
import { useRemoveNews } from "@/modules/news/hooks";
import { EyeIcon, MoreVerticalIcon, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function NewsTableColumnAction(props: News) {
  let removeNews = useRemoveNews();
  let [open, setOpen] = useState(false);

  let disableButton = removeNews.isPending;

  let onClickRemove = withSonnerPromise(
    async () => {
      setOpen(false);
      await removeNews.mutateAsync(props.id);
    },
    {
      loading: "Menghapus berita...",
      success: "Berita berhasil dihapus",
      error: "Gagal menghapus berita, harap coba lagi nanti",
    },
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="size-8" disabled={disableButton}>
          <span className="sr-only">Menu</span>
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a target="_blank" rel="noopener" href={`/news/${props.slug}`}>
            <EyeIcon />
            Lihat
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/admin/news/update/${props.slug}`}>
            <EyeIcon />
            Perbarui
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={preventDefault}>
              <Trash />
              Hapus
            </DropdownMenuItem>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus berita?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah anda yakin ingin menghapus berita ini?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Batalkan</AlertDialogCancel>

              <Button variant="destructive" asChild>
                <AlertDialogAction onClick={onClickRemove}>
                  Ya, hapus berita
                </AlertDialogAction>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
