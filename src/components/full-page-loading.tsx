import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function FullPageLoading(props: { className?: string }) {
  return (
    <div
      className={cn(
        "h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center",
        props.className,
      )}
    >
      <Loader2 className="animate-spin size-8" />
      <p className="font-medium text-muted-foreground">Memuat halaman...</p>
    </div>
  );
}
