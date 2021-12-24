import Head from "next/head";
import styles from "../styles/Home.module.css";

import NavBar from "../components/navbar/navbar.component";
import Banner from "../components/banner/banner.component";
import SectionCards from "../components/card/section-cards.component";

import { getVideos } from "../lib/videos";

export default function Home() {
  const disneyVideos = getVideos()
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <NavBar />
        <Banner
          title="Clifford the red dog"
          subTitle="a very cute dog"
          imgUrl="/static/clifford.webp"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title={"Disney"} videos={disneyVideos} size={"large"} />
          <SectionCards title={"Disney"} videos={disneyVideos} size={"medium"} />
        </div>
      </main>
    </div>
  );
}
