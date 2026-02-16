"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BookmarkList({ user }: any) {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  useEffect(() => {
    fetchBookmarks();

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="bg-white/10 backdrop-blur-lg p-4 rounded-xl flex justify-between items-center"
        >
          <div>
            <a
              href={bookmark.url}
              target="_blank"
              className="text-indigo-400 font-semibold"
            >
              {bookmark.title}
            </a>
          </div>
          <button
            onClick={() => deleteBookmark(bookmark.id)}
            className="text-red-400 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
