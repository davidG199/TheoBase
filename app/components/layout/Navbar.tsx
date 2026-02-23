export default function Navbar() {
  return (
    <nav className="flex flex-row border-b border-[rgb(1,1,1,0.1)] p-4 items-center justify-between h-16">
      <h1>TheBase</h1>
      <div>
        {/* input de busqueda */}
        <div>
          <label htmlFor="search-input"></label>
          <input type="text" id="search-input" name="search-input" />
        </div>
        botones de control
        <div>
          <span>
            <button>Boton 1</button>
            <button>Boton 2</button>
            <button>Boton 3</button>
          </span>
          <span>
            <button>Boton 4</button>
            <button>Boton 5</button>
          </span>
        </div>
      </div>
    </nav>
  );
}
