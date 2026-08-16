import { BellIcon, SearchIcon, UserIcon } from "@/app/common/components/ui/Icons";
import { PageTitle } from "@/app/common/components/ui/PageTitle";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
      <PageTitle />

      <div className="relative hidden max-w-md flex-1 sm:block">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Global search..."
          className="w-full rounded-full bg-gray-100 py-2 pl-9 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-gray-900">User Name</p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Chief Engineer
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-800 text-white">
            <UserIcon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
