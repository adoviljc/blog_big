"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "login" | "register";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
}

// ─── Password strength ────────────────────────────────────────────────────────

function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const levels = [
    { label: "Trop court", color: "#ef4444" },
    { label: "Faible",     color: "#f59e0b" },
    { label: "Bien",       color: "#d97706" },
    { label: "Fort",       color: "#15803d" },
  ];
  return { score, ...levels[Math.max(0, score - 1)] };
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium text-stone-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-lg bg-stone-50 border border-stone-300 text-stone-900 text-sm placeholder:text-stone-300 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
      />
    </div>
  );
}

// ─── Strength bar ─────────────────────────────────────────────────────────────

function StrengthBar({ password }: { password: string }) {
  const { score, label, color } = getStrength(password);
  return (
    <div className="mt-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-3px flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? color : "#e7e5e4" }}
          />
        ))}
      </div>
      {password.length > 0 && (
        <p className="text-[11px] mt-1 transition-colors" style={{ color }}>
          {label}
        </p>
      )}
    </div>
  );
}

// ─── OAuth button ─────────────────────────────────────────────────────────────

function OAuthBtn({
  provider,
  icon,
  label,
}: {
  provider: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => signIn(provider, { callbackUrl: "/dashboard" })}
      className="flex items-center justify-center gap-2 h-38px rounded-lg bg-stone-50 border border-stone-200 text-stone-700 text-sm hover:bg-stone-100 hover:border-stone-300 transition-all"
    >
      {icon}
      {label}
    </button>
  );
}

const GoogleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="#44403c">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

// ─── Login form ───────────────────────────────────────────────────────────────

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
    } else {
      router.push("/");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="font-display text-xl font-bold text-stone-900 mb-1">Bon retour</h1>
      <p className="text-sm text-stone-500 font-light mb-6">Accédez à votre espace personnel.</p>

      <Field label="E-mail" type="email" placeholder="vous@exemple.com" value={email} onChange={setEmail} />
      <Field label="Mot de passe" type="password" placeholder="••••••••" value={password} onChange={setPassword} />

      <button
        type="button"
        className="block text-xs text-amber-600 ml-auto mb-3 hover:underline"
      >
        Mot de passe oublié ?
      </button>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full 42px bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          "Se connecter →"
        )}
      </button>

      <div className="flex items-center gap-2.5 my-4 text-xs text-stone-400">
        <div className="flex-1 h-px bg-stone-200" />
        ou continuer avec
        <div className="flex-1 h-px bg-stone-200" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <OAuthBtn provider="google" icon={<GoogleIcon />} label="Google" />
        <OAuthBtn provider="github" icon={<GithubIcon />} label="GitHub" />
      </div>
    </form>
  );
}

// ─── Register form ────────────────────────────────────────────────────────────

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof RegisterForm) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (getStrength(form.password).score < 2) {
      setError("Mot de passe trop faible.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Erreur lors de la création du compte.");
      }

      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="font-display text-xl font-bold text-stone-900 mb-1">Créer un compte</h1>
      <p className="text-sm text-stone-500 font-light mb-6">Rejoignez la communauté événementielle.</p>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom" placeholder="Jean" value={form.firstName} onChange={set("firstName")} />
        <Field label="Nom" placeholder="Dupont" value={form.lastName} onChange={set("lastName")} />
      </div>

      <Field label="E-mail" type="email" placeholder="vous@exemple.com" value={form.email} onChange={set("email")} />

      <div className="mb-3">
        <label className="block text-[11px] font-medium text-stone-500 uppercase tracking-wider mb-1.5">
          Mot de passe
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => set("password")(e.target.value)}
          className="w-full h-10 px-3 rounded-lg bg-stone-50 border border-stone-300 text-stone-900 text-sm placeholder:text-stone-300 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
        />
        <StrengthBar password={form.password} />
      </div>

      <Field label="Confirmer" type="password" placeholder="••••••••" value={form.confirm} onChange={set("confirm")} />

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-42px bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          "Créer mon compte →"
        )}
      </button>

      <p className="text-[11px] text-stone-400 text-center mt-4 leading-relaxed">
        En créant un compte, vous acceptez nos{" "}
        <a href="/cgu" className="text-amber-600 hover:underline">Conditions d&apos;utilisation</a>{" "}
        et notre{" "}
        <a href="/privacy" className="text-amber-600 hover:underline">Politique de confidentialité</a>.
      </p>
    </form>
  );
}

// ─── Deco panel ───────────────────────────────────────────────────────────────

function DecoPanel({ tab }: { tab: Tab }) {
  return (
    <div className="w-210px flex-shrink-0 bg-amber-50 border-l border-amber-100 p-8 flex flex-col justify-between">
      <span className="text-[10px] font-semibold text-amber-800 tracking-widest uppercase">
        Blog · Événements
      </span>

      <div>
        <p className="font-display text-[19px] font-semibold text-stone-900 leading-snug">
          Transformez vos moments en{" "}
          <span className="text-amber-600">souvenirs éternels.</span>
        </p>
        <div className="flex gap-1.5 mt-3">
          <div
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              tab === "login" ? "bg-amber-600" : "bg-amber-200"
            }`}
          />
          <div
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              tab === "register" ? "bg-amber-600" : "bg-amber-200"
            }`}
          />
        </div>
      </div>

      <ul className="space-y-1 text-xs text-stone-500">
        <li className="flex items-center gap-2">
          <span className="text-amber-600">✦</span> Articles &amp; tutoriels
        </li>
        <li className="flex items-center gap-2">
          <span className="text-amber-600">✦</span> Idées événementielles
        </li>
        <li className="flex items-center gap-2">
          <span className="text-amber-600">✦</span> Souvenirs partagés
        </li>
      </ul>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");

  return (
    <main className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-660px rounded-2xl overflow-hidden border border-stone-200 flex shadow-sm bg-white">

        {/* Form panel */}
        <div className="flex-1 p-10 flex flex-col justify-center">

          {/* Brand */}
          <p className="font-display text-lg font-semibold text-stone-900 mb-8">
            ✦ <span className="text-amber-600">Événements</span> &amp; Souvenirs
          </p>

          {/* Tabs */}
          <div className="flex border-b border-stone-200 mb-7">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`mr-6 pb-2 text-sm font-medium relative transition-colors ${
                  tab === t
                    ? "text-stone-900"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {t === "login" ? "Connexion" : "Créer un compte"}
                {tab === t && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-amber-600 rounded-t" />
                )}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <LoginForm />
          ) : (
            <RegisterForm onSuccess={() => router.push("/")} />
          )}
        </div>

        {/* Deco */}
        <DecoPanel tab={tab} />
      </div>
    </main>
  );
}