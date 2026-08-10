import { useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useAppStore } from "../store/AppStore";
import type { Student } from "../data/mock";

/** Resolve logged-in student record (student portal). */
export function useCurrentStudent(): Student | undefined {
  const { user } = useAuth();
  const { getStudentForUser } = useAppStore();
  return useMemo(() => (user ? getStudentForUser(user) : undefined), [user, getStudentForUser]);
}

/** Parent portal: linked children + selected child. */
export function useParentChildren() {
  const { user } = useAuth();
  const { getStudentsForParent } = useAppStore();
  const children = useMemo(
    () => (user ? getStudentsForParent(user.id) : []),
    [user, getStudentsForParent],
  );
  const [selectedId, setSelectedId] = useState<string | "all">("all");

  const selectedChild = useMemo(() => {
    if (selectedId === "all") return children[0];
    return children.find((c) => c.id === selectedId) ?? children[0];
  }, [children, selectedId]);

  const filterChildren = useMemo(() => {
    if (selectedId === "all") return children;
    return children.filter((c) => c.id === selectedId);
  }, [children, selectedId]);

  return { user, children, selectedId, setSelectedId, selectedChild, filterChildren };
}
