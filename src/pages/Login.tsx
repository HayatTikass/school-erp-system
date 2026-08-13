import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mortarboard01Icon,
  ArrowRight01Icon,
  SquareLock01Icon,
  Mail01Icon,
  UserCircleIcon,
  ViewIcon,
  ViewOffSlashIcon,
} from "hugeicons-react";
import { school } from "../data/mock";
import { Button } from "../components/ui";
import { ROLES, ROLE_META, type Role } from "../types/roles";
import { useAuth } from "../auth/AuthContext";
import { DEMO_PASSWORD } from "../data/users";
import { useToast } from "../components/Toast";

const roleOptions = ROLES.map((r) => ({ value: r, ...ROLE_META[r] }));

const demoHints: { role: Role; email: string }[] = [
  { role: "admin", email: "admin@kingsford.edu.gh" },
  { role: "headmaster", email: "headmaster@kingsford.edu.gh" },
  { role: "accountant", email: "accountant@kingsford.edu.gh" },
  { role: "teacher", email: "teacher@kingsford.edu.gh" },
  { role: "librarian", email: "librarian@kingsford.edu.gh" },
  { role: "hr", email: "hr@kingsford.edu.gh" },
  { role: "student", email: "student@kingsford.edu.gh" },
  { role: "parent", email: "parent@kingsford.edu.gh" },
];

export default function Login() {
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("admin@kingsford.edu.gh");
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onRoleChange = (next: Role) => {
    setRole(next);
    const hint = demoHints.find((d) => d.role === next);
    if (hint) setEmail(hint.email);
    setPassword(DEMO_PASSWORD);
    setError("");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = login(email, password, role, remember);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      toast(result.error, "error");
      return;
    }
    toast(`Welcome back — signed in as ${ROLE_META[role].label}`);
    navigate(ROLE_META[role].portalPath);
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-[560px] lg:shrink-0 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md">
              <Mortarboard01Icon size={26} />
            </div>
            <div>
              <p className="text-lg leading-tight font-bold text-gray-900">{school.name}</p>
              <p className="text-sm text-gray-500">{school.motto}</p>
            </div>
          </div>

          <h1 className="mt-10 text-3xl font-bold tracking-tight text-gray-900">Sign in</h1>
          <p className="mt-2 text-gray-500">Choose your role, then enter your school email and password.</p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">User role</label>
              <div className="relative">
                <UserCircleIcon size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <select
                  value={role}
                  onChange={(e) => onRoleChange(e.target.value as Role)}
                  className="w-full appearance-none rounded-lg border border-gray-300 py-2.5 pr-3 pl-10 text-sm font-medium text-gray-900 shadow-xs focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none"
                >
                  {roleOptions.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1.5 text-xs text-gray-500">{ROLE_META[role].description}</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail01Icon size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 pr-3 pl-10 text-sm shadow-xs focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none"
                  placeholder="you@kingsford.edu.gh"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <SquareLock01Icon size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 pr-10 pl-10 text-sm shadow-xs focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                >
                  {showPassword ? <ViewOffSlashIcon size={18} /> : <ViewIcon size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-error-200 bg-error-50 px-3 py-2.5 text-sm text-error-700">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="size-4 rounded border-gray-300 accent-brand-600"
                />
                Remember me
              </label>
              <button
                type="button"
                className="font-semibold text-brand-700 hover:text-brand-800"
                onClick={() => toast("Contact the school office to reset your password.", "info")}
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading} icon={<ArrowRight01Icon size={18} />}>
              {loading ? "Signing in…" : `Sign in as ${ROLE_META[role].shortLabel}`}
            </Button>
          </form>

          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Demo accounts</p>
            <p className="mt-1 text-xs text-gray-500">
              Password for all roles: <span className="font-semibold text-gray-800">{DEMO_PASSWORD}</span>
            </p>
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {demoHints.map((d) => (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => onRoleChange(d.role)}
                  className="truncate rounded-md px-2 py-1.5 text-left text-xs font-medium text-gray-600 hover:bg-white hover:text-brand-700"
                >
                  {ROLE_META[d.role].shortLabel}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Accounts are created by the school admin. Help: <span className="font-semibold text-gray-700">030 555 0100</span>
          </p>
        </div>
      </div>

      <div className="relative hidden flex-1 overflow-hidden bg-brand-800 lg:block">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-brand-600/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 size-105 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="relative flex h-full flex-col justify-center px-16 xl:px-24">
          <p className="text-sm font-semibold tracking-widest text-brand-200 uppercase">School ERP · {school.year}</p>
          <h2 className="mt-4 max-w-lg text-4xl leading-tight font-bold text-white xl:text-5xl">
            Eight roles. One school system.
          </h2>
          <p className="mt-5 max-w-md text-lg text-brand-100">
            Admin, Headmaster, Accountant, Teacher, Librarian, HR, Student and Parent — each with the tools they need.
          </p>
          <div className="mt-10 grid max-w-md grid-cols-2 gap-3">
            {roleOptions.slice(0, 6).map((r) => (
              <div key={r.value} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                <p className="text-sm font-semibold text-white">{r.shortLabel}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-brand-200">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
