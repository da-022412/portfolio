import * as motion from "motion/react-client";

import Link from "next/link";

export default function Header() {
  return (
    <motion.header
      className="fixed z-30 w-full border-b border-black/10 bg-white/20 backdrop-blur-xl"
      animate={{ opacity: [0, 1], y: [-50, 0] }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between p-5">
          <div>
            <Link
              href="/"
              className="has-focus text-base transition duration-300 ease-in-out hover:text-black/50 md:text-2xl/5"
            >
              Dennis Acosta
            </Link>
          </div>
          <nav>
            <ul className="flex list-none gap-5 md:gap-10">
              <li>
                <Link
                  href="/#work"
                  className="has-focus text-sm transition duration-300 ease-in-out hover:text-black/50 md:text-base"
                >
                  Work
                </Link>
              </li>
              <li>
                <Link
                  href="mai&#108;to&#58;&#37;64en&#37;&#54;&#69;&#37;6&#57;%73&#64;%6&#52;%65nni&#115;a&#99;%6Fs%&#55;4a&#46;%&#54;3o%6D"
                  className="has-focus text-sm transition duration-300 ease-in-out hover:text-black/50 md:text-base"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
