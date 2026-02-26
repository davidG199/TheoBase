import searchIcon from "@public/icons/search-icon.svg";
import settingsIcon from "@public/icons/settings-icon.svg";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex flex-row border-b border-(--border-subtle) px-6 py-3.25 items-center justify-between h-16">
      {/* input de busqueda, titulo y logo */}
      <div className="flex flex-row items-center">
        <h1 className="border-r pr-6 border-[rgb(17,17,17,0.2)] color-(--dark-bar) font-bold text-2xl tracking-[-1.2px]">
          TheoBase
        </h1>
        <span className="flex gap-3 bg-white border border-(--border-subtle) px-4 py-2 text-sm ml-6  placeholder:text-gray-400 ">
          <Image src={searchIcon} alt="Search Icon" />
          <label htmlFor="search-input"></label>
          <input
            className="ring-0 ring-inset ring-gray-300 focus:ring-0 focus:ring-inset focus:ring-indigo-600"
            type="text"
            id="search-input"
            name="search-input"
            placeholder="Busqueda en el tiempo"
          />
        </span>
      </div>
      {/* botones de control */}
      <div className="flex flex-row items-center gap-4">
        <span className="flex flex-row gap-2 px-4 items-center">
          <button className=" h-8 bg-(--subtale-surface) px-3 py-1.5 border border-(--border-subtle) text-sm font-bold tracking-[0.3px] cursor-pointer">
            <span className="bg-(--category-conflict) w-2 h-2 rounded-full inline-block mr-1.5"></span>
            Conflicto
          </button>
          <button className="flex items-center h-8 bg-(--subtale-surface) px-3 py-1.5 border border-(--border-subtle) text-sm font-bold tracking-[0.3px] cursor-pointer">
            <span className="bg-(--category-prophetic) w-2 h-2 rounded-full inline-block mr-1.5"></span>
            Profesia
          </button>
          <button className="flex items-center h-8 bg-(--subtale-surface) px-3 py-1.5 border border-(--border-subtle) text-sm font-bold tracking-[0.3px] cursor-pointer">
            <span className="bg-(--category-sovereign) w-2 h-2 rounded-full inline-block mr-1.5"></span>
            Realeza
          </button>
        </span>
        <button className="bg-(--subtale-surface) w-9 h-9 border border-(--border-subtle) text-sm font-bold tracking-[0.3px] cursor-pointer flex items-center justify-center">
          <Image src={settingsIcon} alt="Settings Icon" />
        </button>
        <button className="bg-(--dark-bar) text-white w-9 h-9 border border-(--border-subtle) text-sm font-bold tracking-[0.3px] cursor-pointer flex items-center justify-center">
          15
        </button>
      </div>
    </nav>
  );
}
