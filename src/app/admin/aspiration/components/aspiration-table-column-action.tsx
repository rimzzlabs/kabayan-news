import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2Icon,
  CheckIcon,
  EyeIcon,
  HourglassIcon,
  MoreVerticalIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";

export function AspirationTableColumnAction(props: Aspiration) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
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
          <DropdownMenuItem>
            <CheckCircle2Icon />
            Verifikasi Aspirasi
          </DropdownMenuItem>
        )}

        {props.status === "diverifikasi" && (
          <DropdownMenuItem>
            <HourglassIcon />
            Proses Aspirasi
          </DropdownMenuItem>
        )}

        {props.status === "diproses" && (
          <DropdownMenuItem>
            <CheckIcon />
            Tandai Selesai
          </DropdownMenuItem>
        )}

        {props.status === "diproses" && (
          <DropdownMenuItem>
            <XIcon />
            Tolak Aspirasi
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <TrashIcon />
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
