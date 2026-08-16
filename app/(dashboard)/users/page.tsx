"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import { createUser, listUsers, useAuth } from "@/app/(dashboard)/hooks/useAuth";
import { handleApiError } from "@/app/(dashboard)/errors/handleApiError";
import { ALL_ROLES, ROLE_LABELS, UserRole } from "@/app/(dashboard)/constant";
import type { ManagedUser } from "@/app/(dashboard)/types";

export default function UsersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [listError, setListError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.SITE_ENGINEER);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reloadUsers = () => {
    setIsLoadingUsers(true);
    setListError("");
    listUsers()
      .then((data) => setUsers(data))
      .catch((err) => setListError(handleApiError(err)))
      .finally(() => setIsLoadingUsers(false));
  };

  useEffect(() => {
    // Inlined rather than calling a shared helper: state updates must live
    // in the .then/.catch/.finally callbacks below, not in a named function
    // invoked directly from the effect body.
    if (!isAdmin) return;
    listUsers()
      .then((data) => setUsers(data))
      .catch((err) => setListError(handleApiError(err)))
      .finally(() => setIsLoadingUsers(false));
  }, [isAdmin]);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);
    try {
      await createUser({ name, email, password, role });
      setName("");
      setEmail("");
      setPassword("");
      setRole(UserRole.SITE_ENGINEER);
      reloadUsers();
    } catch (err) {
      setFormError(handleApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        Only administrators can manage users.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-gray-900">Create User</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add a new team member and assign their role.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {formError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 sm:col-span-2">
              {formError}
            </p>
          )}

          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="name"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label
              htmlFor="new-user-email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="new-user-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@dsss.local"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label
              htmlFor="new-user-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Temporary Password
            </label>
            <input
              id="new-user-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-gray-900">Team Members</h2>

        {isLoadingUsers ? (
          <p className="mt-4 text-sm text-gray-500">Loading users...</p>
        ) : listError ? (
          <p className="mt-4 text-sm text-red-600">{listError}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-140 text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Role</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-100 text-gray-900">
                    <td className="py-2.5 pr-4">{u.name}</td>
                    <td className="py-2.5 pr-4 text-gray-600">{u.email}</td>
                    <td className="py-2.5 pr-4">{ROLE_LABELS[u.role]}</td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
