import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/10">
      <div className="mx-auto max-w-6xl">
        <div className="px-5 py-15 text-center">
          <div className="text-center">
            <h3 className="text-xl/8">Get in Touch</h3>
          </div>
          <div className="mt-2">
            <span className="text-sm text-black/75">
              Interested in collaborating or have a project in mind? I’d be glad
              to hear from you.
              <br />
              <Link
                href="mailto&#58;hell%&#54;&#70;&#64;&#100;&#101;nn%6&#57;%73&#37;6&#49;c&#37;6Fs%7&#52;a&#46;c&#111;m"
                className="has-focus text-black transition duration-300 ease-in-out hover:text-black/50"
              >
                hel&#108;o&#64;dennisaco&#115;ta&#46;&#99;o&#109;
              </Link>
            </span>
          </div>
          <nav className="mt-5 flex items-center justify-center">
            <ul className="flex list-none gap-5 md:gap-10">
              <li>
                <Link
                  href="https://github.com/da-022412"
                  target="_blank"
                  className="group has-focus"
                  aria-label="GitHub"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32.58 31.77"
                    width={24}
                    height={24}
                  >
                    <path
                      fill="#000"
                      fillRule="evenodd"
                      d="M16.29,0C7.29,0,0,7.29,0,16.29c0,7.2,4.67,13.3,11.14,15.46,.81,.15,1.11-.35,1.11-.79,0-.39-.01-1.41-.02-2.77-4.53,.98-5.49-2.18-5.49-2.18-.74-1.88-1.81-2.38-1.81-2.38-1.48-1.01,.11-.99,.11-.99,1.63,.12,2.5,1.68,2.5,1.68,1.45,2.49,3.81,1.77,4.74,1.35,.15-1.05,.57-1.77,1.03-2.18-3.62-.41-7.42-1.81-7.42-8.05,0-1.78,.63-3.23,1.68-4.37-.17-.41-.73-2.07,.16-4.31,0,0,1.37-.44,4.48,1.67,1.3-.36,2.69-.54,4.08-.55,1.38,0,2.78,.19,4.08,.55,3.11-2.11,4.48-1.67,4.48-1.67,.89,2.24,.33,3.9,.16,4.31,1.04,1.14,1.67,2.59,1.67,4.37,0,6.26-3.81,7.63-7.44,8.04,.58,.5,1.11,1.5,1.11,3.02,0,2.18-.02,3.93-.02,4.47,0,.44,.29,.94,1.12,.78,6.47-2.16,11.13-8.26,11.13-15.45C32.58,7.29,25.29,0,16.29,0Z"
                      className="transition duration-300 ease-in-out group-hover:fill-black/50"
                    />
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  href="https://linkedin.com/in/dennis-acosta"
                  target="_blank"
                  className="group has-focus"
                  aria-label="LinkedIn"
                >
                  <svg
                    version="1.1"
                    id="Layer_1"
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 448 512"
                    width={24}
                    height={24}
                  >
                    <path
                      fill="#000"
                      d="M100.3,480H7.4V180.9h92.9V480z M53.8,140.1C24.1,140.1,0,115.5,0,85.8C0,56.1,24.1,32,53.8,32c29.7,0,53.8,24.1,53.8,53.8C107.6,115.5,83.5,140.1,53.8,140.1z M447.9,480h-92.7V334.4c0-34.7-0.7-79.2-48.3-79.2c-48.3,0-55.7,37.7-55.7,76.7V480h-92.8V180.9h89.1v40.8h1.3c12.4-23.5,42.7-48.3,87.9-48.3c94,0,111.3,61.9,111.3,142.3V480H447.9z"
                      className="transition duration-300 ease-in-out group-hover:fill-black/50"
                    />
                  </svg>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
