"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsClient } from "@/hooks/use-is-client";
import { toInitial } from "@/lib/string";
import { useUser } from "@/modules/auth/hooks";
import { pipe } from "@mobily/ts-belt";
import {
  Loader,
  LogInIcon,
  MapPinIcon,
  PhoneIcon,
  User2Icon,
} from "lucide-react";
import { LayoutHeaderProfileLogout } from "./layout-header-profile-logout";

export function LayoutHeaderProfile() {
  let user = useUser();
  let isClient = useIsClient();

  if (!isClient || user.isPending || user.isError) {
    return (
      <Skeleton className="h-9 w-24 grid place-items-center">
        <Loader className="size-3 animate-spin" />
      </Skeleton>
    );
  }

  if (!user.data) {
    return (
      <ButtonLink href="/auth/signin">
        <LogInIcon />
        Login
      </ButtonLink>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="lg" variant="outline" className="px-3">
          <Avatar>
            <AvatarImage
              src={user.data.foto_profil ?? undefined}
              alt={user.data?.nama ?? ""}
            />
            <AvatarFallback>
              {pipe(user.data?.nama ?? "User Profile", toInitial())}
            </AvatarFallback>
          </Avatar>

          {user.data?.nama ?? "User Profile"}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end">
        <p className="text-sm font-medium">Akun Saya</p>

        <div className="py-4 grid gap-3">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <User2Icon className="size-4 shrink-0" />
            <p className="text-sm font-medium">{user.data.nama}</p>
          </div>

          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <PhoneIcon className="size-4 shrink-0" />
            <p className="text-sm font-medium">{user.data.no_hp}</p>
          </div>

          <div className="inline-flex items-start gap-2 text-muted-foreground">
            <MapPinIcon className="size-4 shrink-0" />
            <p className="text-sm font-medium">{user.data.alamat}</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <LayoutHeaderProfileLogout />
        </div>
      </PopoverContent>
    </Popover>
  );
}
