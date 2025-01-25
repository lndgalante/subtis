import { Link } from "@remix-run/react";
import { SearchButton } from "./search-button";
import { Logo } from "./logo";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 container mx-auto">
      <nav className="flex items-center justify-between py-4 px-4 w-full">
        <Link to="/" className="cursor-pointer group">
          <div className="relative w-fit h-fit isolate">
            <div className="border-2 relative z-10 border-[#0E0C14] w-[76px] h-[29px] flex items-center justify-center rounded-[6px] bg-white text-[#0E0C14] transition-all duration-300 ease-in-out group-hover:-translate-x-[3px] group-hover:-translate-y-[3px]">
              <Logo />
            </div>
            <div className="absolute inset-0 rounded-[6px] bg-white" />
          </div>
        </Link>
        <SearchButton />
      </nav>
    </header>
  );
}
