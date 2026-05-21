import { api } from "@/app/lib/api";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "MODERATOR" | "USER";
  createdAt: string;
  _count: {
    posts: number;
  };
}

const ROLE_STYLES: Record<User["role"], { label: string; className: string }> = {
  ADMIN: {
    label: "ADMIN",
    className: "bg-red-400/10 text-red-400",
  },
  MODERATOR: {
    label: "MODERATOR",
    className: "bg-blue-400/10 text-blue-400",
  },
  USER: {
    label: "USER",
    className: "bg-amber-400/10 text-amber-400",
  },
};

function UserAvatar({ name, email }: { name: string | null; email: string }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : email[0].toUpperCase();

  return (
    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white/70 shrink-0">
      {initials}
    </div>
  );
}

export default async function UsersPage() {
  const users: User[] = await api.users.getAll();

 
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-white/40 text-sm mt-1">
            {users.length} utilisateur{users.length > 1 ? "s" : ""}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-amber-400 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-300 transition-colors">
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouvel utilisateur
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        {(["ADMIN", "MODERATOR", "USER"] as User["role"][]).map((role) => {
          const count = users.filter((u) => u.role === role).length;
          const { label, className } = ROLE_STYLES[role];
          return (
            <div
              key={role}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-4"
            >
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">
                {label}s
              </p>
              <p className="text-2xl font-bold">{count}</p>
              <span
                className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${className}`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>


      {/* Detailed table */}
      <div className="rounded-xl border border-white/10 overflow-hidden mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left px-4 py-3 text-white/40 font-medium">
                Utilisateur
              </th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">
                Email
              </th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">
                Rôle
              </th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">
                Articles
              </th>
              <th className="text-left px-4 py-3 text-white/40 font-medium">
                Membre depuis
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={user.id}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                  i === users.length - 1 ? "border-0" : ""
                }`}
              >
                {/* Avatar + name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.name} email={user.email} />
                    <span className="font-medium">
                      {user.name ?? "Sans nom"}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3 text-white/40 font-mono text-xs">
                  {user.email}
                </td>

                {/* Role badge */}
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      ROLE_STYLES[user.role].className
                    }`}
                  >
                    {ROLE_STYLES[user.role].label}
                  </span>
                </td>

                {/* Post count */}
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-amber-400/10 text-amber-400 rounded-full text-xs font-medium">
                    {user._count.posts} article{user._count.posts > 1 ? "s" : ""}
                  </span>
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-white/30 text-xs">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-white/30 hover:text-white transition-colors text-xs">
                      Modifier
                    </button>
                    <button className="text-white/30 hover:text-red-400 transition-colors text-xs">
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}