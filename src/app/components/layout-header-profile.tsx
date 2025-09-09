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
  ArrowRight,
  Loader,
  LogInIcon,
  MapPinIcon,
  ShieldUserIcon,
  User2Icon,
} from "lucide-react";
import { LayoutHeaderProfileLogout } from "./layout-header-profile-logout";
import { title } from "radash";

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
        <Button size="lg" variant="outline" className="px-2 lg:px-3">
          <Avatar>
            <AvatarImage
              src={user.data.foto_profil ?? undefined}
              alt={user.data?.nama ?? ""}
            />
            <AvatarFallback>
              {pipe(user.data?.nama ?? "User Profile", toInitial())}
            </AvatarFallback>
          </Avatar>

          <span className="sr-only lg:not-sr-only">
            {user.data?.nama ?? "User Profile"}
          </span>
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
            <ShieldUserIcon className="size-4 shrink-0" />
            <p className="text-sm font-medium">{title(user.data.role)}</p>
          </div>

          <div className="inline-flex items-start gap-2 text-muted-foreground">
            <MapPinIcon className="size-4 shrink-0" />
            <p className="text-sm font-medium">{user.data.alamat}</p>
          </div>
        </div>

        {user.data.role === "admin" && (
          <div className="py-2 border-b">
            <ButtonLink variant="outline" href="/admin" className="w-full">
              Dashboard <ArrowRight />
            </ButtonLink>
          </div>
        )}

        <div className="pt-2">
          <LayoutHeaderProfileLogout />
        </div>
      </PopoverContent>
    </Popover>
  );
}
