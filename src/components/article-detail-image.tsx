import { ImageOff } from "lucide-react";
import Image from "next/image";

export function ArticleDetailImage(props: {
  alt?: string;
  src?: string | null;
}) {
  if (!props.src || !props.alt) {
    return (
      <div className="bg-muted rounded-md text-muted-foreground w-full aspect-video flex flex-col items-center justify-center">
        <ImageOff className="size-10" />
        <p className="text-muted-foreground font-medium text-sm">
          Belum ada foto
        </p>
      </div>
    );
  }

  return (
    <figure>
      <Image
        priority
        width={840}
        height={720}
        src={props.src}
        alt={props.alt}
        className="w-full aspect-video rounded-md"
      />
    </figure>
  );
}
