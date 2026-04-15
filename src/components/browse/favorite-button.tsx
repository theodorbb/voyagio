"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  activityId: string;
  initialFavorited: boolean;
  size?: "sm" | "md";
}

export function FavoriteButton({
  activityId,
  initialFavorited,
  size = "sm",
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  async function toggleFavorite() {
    if (!session) {
      router.push("/login");
      return;
    }

    const prev = isFavorited;
    setIsFavorited(!prev);

    try {
      const res = await fetch("/api/favorites", {
        method: isFavorited ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId }),
      });

      if (!res.ok) {
        setIsFavorited(prev);
      } else {
        startTransition(() => router.refresh());
      }
    } catch {
      setIsFavorited(prev);
    }
  }

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const btnSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  return (
    <button
      onClick={toggleFavorite}
      disabled={isPending}
      className={cn(
        "flex items-center justify-center rounded-full transition-all duration-300",
        btnSize,
        isFavorited
          ? "bg-red-500/90 text-white shadow-lg shadow-red-500/25"
          : "bg-black/50 text-white/70 backdrop-blur-sm hover:bg-black/70 hover:text-white"
      )}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(iconSize, isFavorited && "fill-current", "transition-transform", isPending && "scale-90")}
      />
    </button>
  );
}
