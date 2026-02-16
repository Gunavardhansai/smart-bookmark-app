// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import LoginButton from "@/components/LoginButton";
// import BookmarkForm from "@/components/BookmarkForm";
// import BookmarkList from "@/components/BookmarkList";

// export default function Home() {
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     supabase.auth.getUser().then(({ data }) => {
//       setUser(data.user);
//     });

//     supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user || null);
//     });
//   }, []);

//   if (!user)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <LoginButton />
//       </div>
//     );

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-4xl font-bold mb-6 text-center">
//         Smart Bookmark Manager
//       </h1>

//       <BookmarkForm user={user} />
//       <BookmarkList user={user} />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ---------------- AUTH ----------------
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  // ---------------- FETCH ----------------
  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  useEffect(() => {
    if (!user) return;

    fetchBookmarks();

    // const channel = supabase
    //   .channel("bookmarks-channel")
    //   .on(
    //     "postgres_changes",
    //     { event: "*", schema: "public", table: "bookmarks" },
    //     () => fetchBookmarks()
    //   )
    //   .subscribe();

    // return () => {
    //   supabase.removeChannel(channel);
    // };
  }, [user]);

  // ---------------- LOGIN ----------------
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // ---------------- ADD ----------------
  // const addBookmark = async () => {
  //   if (!title || !url) return alert("Fill all fields");

  //   if (!url.startsWith("http")) {
  //     return alert("URL must start with http or https");
  //   }

  //   await supabase.from("bookmarks").insert([
  //     {
  //       title,
  //       url,
  //       user_id: user.id,
  //     },
  //   ]);

  //   setTitle("");
  //   setUrl("");
  // };

  const addBookmark = async () => {
  if (!title || !url) return alert("Fill all fields");

  if (!url.startsWith("http")) {
    return alert("URL must start with http or https");
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (!error && data) {
    setBookmarks((prev) => [data, ...prev]);
  }

    setTitle("");
    setUrl("");
  };


  // ---------------- DELETE ----------------
  // const deleteBookmark = async (id: string) => {
  //   await supabase.from("bookmarks").delete().eq("id", id);
  // };
  const deleteBookmark = async (id: string) => {
  await supabase.from("bookmarks").delete().eq("id", id);

  setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };


  // ---------------- FILTER ----------------
  const filtered = bookmarks.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Loading...
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        <button
          onClick={login}
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
        >
          Sign in with Google
        </button>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Smart Bookmark Manager</h1>
        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Add Form */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl mb-6">
        <input
          className="w-full p-3 mb-3 rounded bg-black/40"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full p-3 mb-3 rounded bg-black/40"
          placeholder="https://example.com"
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

      {/* Search */}
      <input
        className="w-full p-3 mb-6 rounded bg-black/40"
        placeholder="Search bookmarks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-400">
          No bookmarks found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-white/10 backdrop-blur-lg p-4 rounded-xl flex justify-between items-center hover:scale-[1.02] transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${bookmark.url}`}
                  alt="favicon"
                  className="w-5 h-5"
                />
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
      )}
    </div>
  );
}
