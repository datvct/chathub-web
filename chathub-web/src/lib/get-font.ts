import localFont from "next/font/local"

export const robotoFont = localFont({
  src: [
    {
      path: "../../public/fonts/Roboto-Thin.ttf",
      weight: "100",
      style: "light",
    },
    {
      path: "../../public/fonts/Roboto-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Roboto-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Roboto-Medium.ttf",
      weight: "500",
      style: "medium",
    },
    {
      path: "../../public/fonts/Roboto-Bold.ttf",
      weight: "700",
      style: "bold",
    },
    {
      path: "../../public/fonts/Roboto-Black.ttf",
      weight: "900",
      style: "black",
    },
  ],
})
