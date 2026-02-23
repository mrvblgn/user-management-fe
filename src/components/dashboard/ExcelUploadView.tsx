"use client";

import { useState } from "react";
import Link from "next/link";

interface UploadResult {
  message?: string;
  count?: number;
  error?: string;
  row?: number;
}

export default function ExcelUploadView() {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setResult({ error: "Dosya secmelisin" });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/users/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as UploadResult;

      if (!response.ok) {
        setResult({ error: data.error || "Yukleme basarisiz", row: data.row });
        return;
      }

      setResult({ message: data.message, count: data.count });
      setFile(null);
    } catch {
      setResult({ error: "Beklenmeyen bir hata olustu" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_45%),radial-gradient(circle_at_20%_30%,_rgba(248,113,113,0.18),_transparent_40%)]" />
        <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-14">
          <header className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                  Kullanıcı Yönetimi
                </p>
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  Toplu Excel Yükleme
                </h1>
              </div>
              <Link
                href="/dashboard"
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Panele dön
              </Link>
            </div>
            <p className="max-w-2xl text-base text-zinc-300">
              Excel dosyasını yükleyerek kullanıcıları toplu olarak ekleyebilirsin.
              Hatalı satır olursa tüm işlem iptal edilir.
            </p>
          </header>

          <section className="grid gap-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
              <p className="font-medium text-white">Beklenen kolonlar</p>
              <p className="mt-2">
                firstName, lastName, email, age, password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="excel">
                  Excel dosyasını seç
                </label>
                <input
                  id="excel"
                  name="excel"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  className="block w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white/90 hover:file:bg-white/20"
                />
              </div>

              {result?.error ? (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {result.error}
                  {typeof result.row === "number" && result.row > 0
                    ? ` (Satir: ${result.row})`
                    : ""}
                </div>
              ) : null}

              {result?.message ? (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                  {result.message}
                  {typeof result.count === "number"
                    ? ` (${result.count} kayıt)`
                    : ""}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-11 rounded-lg bg-white px-6 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Yükleniyor..." : "Yüklemeyi başlat"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
