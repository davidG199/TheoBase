export default function Navbar() {
  return (
    <nav className="flex flex-row border-b border-[rgb(1,1,1,0.1)] px-6 py-3.25 items-center justify-between h-16">
      {/* input de busqueda, titulo y logo */}
      <div className="flex flex-row items-center gap-3">
        <h1 className="border-r pr-5 border-(--dark-bar)">TheoBase</h1>
        <label htmlFor="search-input"></label>
        <input 
          className="bg-white border-0 rounded-md px-3 py-2 text-sm shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          type="text" 
          id="search-input" 
          name="search-input"
          placeholder="Busqueda en el tiempo"/>
      </div>
      {/* botones de control */}
      <div className="flex flex-row items-center gap-5">
        <span className="flex flex-row gap-2">
          <button className="bg-(--subtale-surface) px-2.5 py-1 rounded-(--btn-controlls-radius)">Conflicto</button>
          <button className="bg-(--subtale-surface) px-2.5 py-1 rounded-(--btn-controlls-radius)">Profesia</button>
          <button className="bg-(--subtale-surface) px-2.5 py-1 rounded-(--btn-controlls-radius)">Realeza</button>
        </span>
        <span className="flex gap-3">
          <button>12</button>
          <button>15</button>
        </span>
      </div>
    </nav>
  );
}
