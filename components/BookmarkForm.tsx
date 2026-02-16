"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BookmarkForm({ user }: any) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const addBookmark = async () => {
    if (!title || !url) return;

    await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]);

    setTitle("");
    setUrl("");
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl mb-6">
      <input
        className="w-full p-3 mb-3 rounded bg-black/40"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="w-full p-3 mb-3 rounded bg-black/40"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        onClick={addBookmark}
        className="bg-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
      >
        Add Bookmark
      </button>
    </div>
  );
}
