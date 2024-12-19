import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head/>
      <meta name="viewport" content="width=device-width, user-scalable=false;" />
      <body className="antialiased">
        <Main className="w-screen h-screen overflow-hidden" />
        <NextScript />
      </body>
    </Html>
  );
}
