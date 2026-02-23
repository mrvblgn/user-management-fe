"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { UserResponse } from "@/repositories/user.repository";

interface DashboardViewProps {
  users: UserResponse[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  age?: number;
}

const buildQuery = (params: {
  page: number;
  pageSize: number;
  age?: number;
}) => {
  const query = new URLSearchParams();
  query.set("page", String(params.page));
  query.set("pageSize", String(params.pageSize));
  if (params.age) {
    query.set("age", String(params.age));
  }
  return `?${query.toString()}`;
};

export default function DashboardView({
  users,
  page,
  pageSize,
  total,
  totalPages,
  age,
}: DashboardViewProps) {
  const hasUsers = users.length > 0;
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_45%),radial-gradient(circle_at_20%_30%,_rgba(248,113,113,0.18),_transparent_40%)]" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14">
          <header className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                  KULLANICI YÖNETİMİ
                </p>
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  Panel
                </h1>
              </div>
              <div className="hidden items-center gap-3 md:flex">
                <Link
                  href="/dashboard/addMany"
                  className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white"
                >
                  Excel Yükle
                </Link>
                <Link
                  href="/dashboard/add"
                  className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white"
                >
                  Yeni Kullanıcı Ekle
                </Link>
                <span className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-950">
                  Toplam {total} kullanıcı
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-red-500/30 px-5 py-2 text-sm font-medium text-red-300 transition hover:border-red-500/50 hover:bg-red-500/10"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
            <p className="max-w-2xl text-base text-zinc-300">
              Kullanıcı büyümesini izle, son aktiviteleri gör ve toplu
              yüklemeleri tek ekrandan yönet.
            </p>
          </header>

          <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Kullanıcı listesi</h2>
                <p className="text-sm text-zinc-400">
                  Sayfalandırma ve yaş filtresi URL parametreleriyle çalışır.
                </p>
              </div>
              <form action="/dashboard" method="get" className="flex flex-wrap gap-3">
                <input type="hidden" name="page" value="1" />
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  Yaş
                  <input
                    type="number"
                    name="age"
                    min="1"
                    defaultValue={age ?? ""}
                    className="h-10 w-24 rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-sky-400/60"
                    placeholder="Örn. 30"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  Sayfa boyutu
                  <select
                    name="pageSize"
                    defaultValue={String(pageSize)}
                    className="h-10 rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-sky-400/60"
                  >
                    {[5, 10, 20, 50].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                >
                  Filtrele
                </button>
              </form>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
              <div className="grid grid-cols-4 gap-4 border-b border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-wide text-zinc-400">
                <span>Ad Soyad</span>
                <span>Email</span>
                <span>Yaş</span>
                <span>Kayıt tarihi</span>
              </div>

              {hasUsers ? (
                <div className="divide-y divide-white/10">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-4 gap-4 px-4 py-3 text-sm text-zinc-200"
                    >
                      <Link
                        href={`/dashboard/${user.id}`}
                        className="font-medium text-white hover:text-sky-300"
                      >
                        {user.firstName} {user.lastName}
                      </Link>
                      <span className="truncate text-zinc-300">{user.email}</span>
                      <span>{user.age}</span>
                      <span className="text-zinc-400">
                        {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-sm text-zinc-400">
                  Gösterilecek kullanıcı bulunamadı.
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-zinc-300">
              <span>
                Toplam {total} kayıt, sayfa {page} / {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard${buildQuery({
                    page: Math.max(1, page - 1),
                    pageSize,
                    age,
                  })}`}
                  className={`rounded-lg border border-white/10 px-3 py-2 transition ${
                    page <= 1
                      ? "pointer-events-none opacity-50"
                      : "hover:border-white/30"
                  }`}
                >
                  Önceki
                </Link>
                <Link
                  href={`/dashboard${buildQuery({
                    page: Math.min(totalPages, page + 1),
                    pageSize,
                    age,
                  })}`}
                  className={`rounded-lg border border-white/10 px-3 py-2 transition ${
                    page >= totalPages
                      ? "pointer-events-none opacity-50"
                      : "hover:border-white/30"
                  }`}
                >
                  Sonraki
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
