import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed z-30 w-full border-b border-black/10 bg-white/20 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between p-5">
          <div>
            <Link
              href="/"
              className="text-base transition duration-300 ease-in-out hover:text-black/50 md:text-2xl/5"
            >
              Dennis Acosta
            </Link>
          </div>
          <nav>
            <ul className="flex list-none gap-5 md:gap-10">
              <li>
                <Link
                  href="#work"
                  className="text-sm transition duration-300 ease-in-out hover:text-black/50 md:text-base"
                >
                  Work
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-sm transition duration-300 ease-in-out hover:text-black/50 md:text-base"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
