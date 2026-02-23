import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceFactory } from "@/services";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const userService = ServiceFactory.createUserService();
  const { userId } = await params;
  const user = await userService.getUserById(userId);

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_45%),radial-gradient(circle_at_20%_30%,_rgba(248,113,113,0.18),_transparent_40%)]" />
        <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-14">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                Kullanıcı Detayı
              </p>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {user.firstName} {user.lastName}
              </h1>
              <p className="mt-2 text-sm text-zinc-300">{user.email}</p>
            </div>
            <Link
              href="/dashboard"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white"
            >
              Panele dön
            </Link>
          </header>

          <section className="grid gap-4 rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
            <div className="grid gap-2">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Temel bilgiler
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-zinc-400">Ad</p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {user.firstName}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-zinc-400">Soyad</p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {user.lastName}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-zinc-400">Email</p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {user.email}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-zinc-400">Yas</p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {user.age}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Kayit bilgileri
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-zinc-400">Kayit tarihi</p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {new Date(user.createdAt).toLocaleString("tr-TR")}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-zinc-400">Guncelleme tarihi</p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {new Date(user.updatedAt).toLocaleString("tr-TR")}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
