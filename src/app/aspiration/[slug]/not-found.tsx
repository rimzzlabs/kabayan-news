import { Title } from "@/components/title";
import { ButtonLink } from "@/components/ui/button";
import { MessageCircleOff } from "lucide-react";

export default function NotFound() {
  return (
    <section className="h-[calc(100vh-4rem)] grid place-items-center">
      <div className="flex flex-col items-center text-center max-w-xl w-full">
        <MessageCircleOff className="stroke-muted-foreground size-16" />
        <Title className="pt-3">Artkel Aspirasi Tidak Ditemukan</Title>
        <p className="font-medium text-muted-foreground pt-2 pb-5 text-balance">
          Oops, nampaknya aspirasi yang Anda cari tidak dapat kami temukan,
          pastikan URL yang Anda masukkan benar. Silakan hubungi Desa Kabayan
          untuk informasi lebih lanjut.
        </p>

        <ButtonLink href="/aspiration">Lihat aspirasi terbaru</ButtonLink>
      </div>
    </section>
  );
}
