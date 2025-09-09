"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsClient } from "@/hooks/use-is-client";
import { useAspirations } from "@/modules/aspiration/hooks";
import { useUser } from "@/modules/auth/hooks";
import { F, O, pipe } from "@mobily/ts-belt";
import { Loader, NewspaperIcon } from "lucide-react";
import { RecentAspirationListItem } from "./recent-aspiration-list-item";
import { useIsMobile } from "@/hooks/use-mobile";

export function RecentAspirationList() {
  let isMobile = useIsMobile();
  let userQuery = useUser();
  let isClient = useIsClient();
  let aspirationsQuery = useAspirations({
    userId: userQuery.data?.id,
    limit: 4,
  });

  let aspirations = pipe(
    aspirationsQuery.data?.data,
    O.fromNullable,
    O.mapWithDefault([], F.identity),
    F.toMutable,
  );

  let isPending = aspirationsQuery.isPending;

  if (!isClient) {
    return (
      <div className="xl:col-span-2">
        <h2 className="text-lg lg:text-xl font-semibold">
          Aspirasi Terbaru Anda
        </h2>

        <div className="h-80 grid place-items-center">
          <Loader className="animate-spin size-5" />
        </div>
      </div>
    );
  }

  return (
    <div className="xl:col-span-2">
      <h2 className="text-lg lg:text-xl font-semibold pb-2">
        Aspirasi Terbaru Anda
      </h2>

      {isPending && (
        <div className="h-80 grid place-items-center">
          <Loader className="animate-spin size-5" />
        </div>
      )}

      {!isPending && aspirations.length === 0 && (
        <div className="h-80 grid place-items-center text-muted-foreground">
          <div className="flex flex-col items-center justify-center">
            <NewspaperIcon className="size-6" />
            <p className="text-center font-medium ">
              Anda belum membuat aspirasi
            </p>
          </div>
        </div>
      )}

      {!isPending &&
        aspirations.length > 0 &&
        aspirations.length > 3 &&
        (isMobile ? (
          <div className="grid gap-4 py-6">
            {aspirations.map((asp) => (
              <RecentAspirationListItem key={asp.id} {...asp} />
            ))}
          </div>
        ) : (
          <ScrollArea className="h-[40rem]">
            <div className="grid gap-4 py-6">
              {aspirations.map((asp) => (
                <RecentAspirationListItem key={asp.id} {...asp} />
              ))}
            </div>
          </ScrollArea>
        ))}

      {!isPending && aspirations.length > 0 && aspirations.length <= 3 && (
        <div className="grid gap-4 py-6 ">
          {aspirations.map((asp) => (
            <RecentAspirationListItem key={asp.id} {...asp} />
          ))}
        </div>
      )}
    </div>
  );
}
