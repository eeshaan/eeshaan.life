import Head from "next/head";
import Image from "next/image";
import dynamic from "next/dynamic";

import { Email } from "react-obfuscate-email";

import SmartQuotes from "../components/SmartQuotes";
import LogoAnimation from "../components/LogoAnimation";
import SpotifyStatus from "../components/SpotifyStatus";

export default function Home() {
  return (
    <SmartQuotes>
      <div className="container">
        <Head>
          <title>Eeshaan Pirani</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="main">
          <div className="intro">
            <LogoAnimation />
            <h1>Eeshaan Pirani</h1>
            <p>
              I'm a software engineer with an eye for design and a passion for
              making meaningful impact through technology.
            </p>
            <p>
              I'm currently based in Boston and working full-time, but I'm
              always open to exciting new opportunities, whenever and wherever
              they may arise. Feel free to email{" "}
              <Email email="me@eeshaan.life" subject="Hi 👋" />.
            </p>
          </div>
          <SpotifyStatus />
        </main>
      </div>
    </SmartQuotes>
  );
}
