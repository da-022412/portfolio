import localFont from "next/font/local";

export const GTWalsheimProRegular = localFont({
  src: [
    {
      path: "../fonts/GTWalsheimProRegular.ttf",
      style: "normal",
      weight: "400",
    },
  ],
  variable: "--font-body",
});
