import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mortarboard01Icon,
  UserGroupIcon,
  TeacherIcon,
  StudentIcon,
  UserMultipleIcon,
  ArrowRight01Icon,
  SquareLock01Icon,
  Mail01Icon,
} from "hugeicons-react";
import { cn } from "../lib/utils";
import { school } from "../data/mock";
import { Button } from "../components/ui";

const portals = [
  {
    role: "admin",
    label: "Administration",
    desc: "Full system control — users, finance & operations",
    icon: UserGroupIcon,
    color: "bg-brand-50 text-brand-600 ring-brand-100",
  },
  {
    role: "teacher",
    label: "Teacher",
    desc: "Classroom delivery, assessments & progress",
    icon: TeacherIcon,
    color: "bg-blue-50 text-blue-600 ring-blue-100",
  },
  {
    role: "student",
    label: "Student",
    desc: "Results, assignments, schedule & resources",
    icon: StudentIcon,
    color: "bg-success-50 text-success-600 ring-success-100",
  },
  {
    role: "parent",
    label: "Parent / Guardian",
    desc: "Monitor progress, fees & communication",
    icon: UserMultipleIcon,
    color: "bg-orange-50 text-orange-600 ring-orange-100",
  },
] as const;

export default function Login() {
  const [selected, setSelected] = useState<(typeof portals)[number]["role"]>("admin");
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      {/* Left — form */}
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

          <h1 className="mt-10 text-3xl font-bold tracking-tight text-gray-900">Welcome back</h1>
          <p className="mt-2 text-gray-500">Select your portal and sign in to continue.</p>

          {/* Portal selection */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            {portals.map((p) => (
              <button
                key={p.role}
                onClick={() => setSelected(p.role)}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all",
                  selected === p.role
                    ? "border-brand-600 bg-brand-25 ring-4 ring-brand-100"
                    : "border-gray-200 bg-white hover:border-gray-300",
                )}
              >
                <div className={cn("mb-2.5 flex size-9 items-center justify-center rounded-lg ring-4", p.color)}>
                  <p.icon size={20} />
                </div>
                <p className="text-sm font-semibold text-gray-900">{p.label}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{p.desc}</p>
              </button>
            ))}
          </div>

          {/* Credentials */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail01Icon size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  defaultValue="demo@kingsford.edu.gh"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pr-3 pl-10 text-sm shadow-xs focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <SquareLock01Icon size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  defaultValue="password"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pr-3 pl-10 text-sm shadow-xs focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" defaultChecked className="size-4 rounded border-gray-300 accent-brand-600" />
                Remember me
              </label>
              <button className="font-semibold text-brand-700 hover:text-brand-800">Forgot password?</button>
            </div>
            <Button size="lg" className="w-full" onClick={() => navigate(`/${selected}`)} icon={<ArrowRight01Icon size={18} />}>
              Sign in to {portals.find((p) => p.role === selected)?.label}
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Trouble signing in? Contact the school office at <span className="font-semibold text-gray-700">030 555 0100</span>
          </p>
        </div>
      </div>

      {/* Right — showcase */}
      <div className="relative hidden flex-1 overflow-hidden bg-brand-800 lg:block">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-brand-600/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 size-105 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="relative flex h-full flex-col justify-center px-16 xl:px-24">
          <p className="text-sm font-semibold tracking-widest text-brand-200 uppercase">School ERP · {school.year}</p>
          <h2 className="mt-4 max-w-lg text-4xl leading-tight font-bold text-white xl:text-5xl">
            One platform for the whole school community.
          </h2>
          <p className="mt-5 max-w-md text-lg text-brand-100">
            Admissions, academics, finance, communication and more — connected across administrators, teachers, students and parents.
          </p>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              { v: "184", l: "Students enrolled" },
              { v: "97%", l: "Fee collection rate" },
              { v: "12+", l: "Integrated modules" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-2xl font-bold text-white">{s.v}</p>
                <p className="mt-1 text-xs text-brand-200">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
