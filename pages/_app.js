import "../styles/main.scss";
import { helveticaNowVar, loretta, valty } from "../lib/fonts";

function MyApp({ Component, pageProps }) {
  return (
    <main
      className={`${helveticaNowVar.variable} ${loretta.variable} ${valty.variable}`}
    >
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
