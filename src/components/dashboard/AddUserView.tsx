"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  firstName: z.string().min(1, "Ad zorunludur"),
  lastName: z.string().min(1, "Soyad zorunludur"),
  email: z.string().email("Email geçersiz"),
  age: z.number().int().min(1, "Yaş geçersiz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

type FormValues = z.infer<typeof schema>;

export default function AddUserView() {
  const [result, setResult] = useState<{ error?: string; success?: string } | null>(
    null
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setResult(null);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setResult({ error: data.error || "Kayit basarisiz" });
        return;
      }

      setResult({ success: "Kullanıcı oluşturuldu" });
      reset();
    } catch {
      setResult({ error: "Beklenmeyen bir hata oluştu" });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_45%),radial-gradient(circle_at_20%_30%,_rgba(248,113,113,0.18),_transparent_40%)]" />
        <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-14">
          <header className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                  Kullanıcı Yönetimi
                </p>
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  Yeni Kullanıcı Ekle
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
              Yeni kullanıcı bilgilerini doldur ve kaydet.
            </p>
          </header>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="firstName">
                  Ad
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register("firstName")}
                  className="h-11 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-sky-400/60"
                />
                {errors.firstName ? (
                  <p className="text-xs text-red-300">{errors.firstName.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="lastName">
                  Soyad
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register("lastName")}
                  className="h-11 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-sky-400/60"
                />
                {errors.lastName ? (
                  <p className="text-xs text-red-300">{errors.lastName.message}</p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="h-11 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-sky-400/60"
                />
                {errors.email ? (
                  <p className="text-xs text-red-300">{errors.email.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="age">
                  Yaş
                </label>
                <input
                  id="age"
                  type="number"
                  min="1"
                  {...register("age", { valueAsNumber: true })}
                  className="h-11 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-sky-400/60"
                />
                {errors.age ? (
                  <p className="text-xs text-red-300">{errors.age.message}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="h-11 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-sky-400/60"
              />
              {errors.password ? (
                <p className="text-xs text-red-300">{errors.password.message}</p>
              ) : null}
            </div>

            {result?.error ? (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {result.error}
              </div>
            ) : null}

            {result?.success ? (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                {result.success}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-lg bg-white px-6 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Kaydediliyor..." : "Kullanıcı ekle"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
