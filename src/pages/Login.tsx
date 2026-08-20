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
import loginHeroBg from "../assets/login-hero-bg.png";
import { Button } from "../components/ui";
import { ROLES, ROLE_META, type Role } from "../types/roles";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../components/Toast";

const roleOptions = ROLES.map((r) => ({ value: r, ...ROLE_META[r] }));

export default function Login() {
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onRoleChange = (next: Role) => {
    setRole(next);
    setError("");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password, role, remember);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      toast(result.error, "error");
      return;
    }
    toast(`Welcome back · signed in as ${ROLE_META[role].label}`);
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

          <p className="mt-6 text-center text-sm text-gray-500">
            Accounts are created by the school admin. Help: <span className="font-semibold text-gray-700">030 555 0100</span>
          </p>
        </div>
      </div>

      <div className="relative hidden flex-1 overflow-hidden lg:block">
        <img
          src={loginHeroBg}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-900/75 to-brand-800/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(127,86,217,0.35),transparent_55%)]" />
        <div className="relative flex h-full flex-col justify-center px-16 xl:px-24">
          <p className="text-sm font-semibold tracking-widest text-brand-200 uppercase">
            {school.name} · {school.year}
          </p>
          <h2 className="mt-4 max-w-lg text-4xl leading-tight font-bold text-white xl:text-5xl">
            {school.motto}
          </h2>
          <p className="mt-5 max-w-md text-lg text-brand-100">
            Sign in to your {school.term} portal · attendance, grades, fees, library and school updates in one secure place.
          </p>
        </div>
      </div>
    </div>
  );
}
