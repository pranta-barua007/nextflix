import Head from "next/head";
import styles from "../styles/Home.module.css";

import NavBar from "../components/navbar/navbar.component";
import Banner from "../components/banner/banner.component";
import SectionCards from "../components/card/section-cards.component";

import { getVideos, getPopularVideos, getWatchItAgainVideos } from "../lib/videos";
import useRedirectUser from "../utils/redirectUser.util";

export async function getServerSideProps(context) {
  const { userId, token } = await useRedirectUser(context);

  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);
  const disneyVideos = await getVideos("disney trailer");
  const productivityVideos = await getVideos("productivity");
  const travelVideos = await getVideos("travel");

  const popularVideos = await getPopularVideos("US");

  return {props: { disneyVideos, productivityVideos, travelVideos, popularVideos, watchItAgainVideos }}
}

export default function Home({ disneyVideos, travelVideos, productivityVideos, popularVideos, watchItAgainVideos = [] }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nextflix</title>
        <meta name="description" content="The Next Gen Netflix ⚡ built with NextJs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <NavBar />
        <Banner
          videoId="4zH5iYM4wJo"
          title="Clifford the red dog"
          subTitle="a very cute dog"
          imgUrl="/static/clifford.webp"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title={"Disney"} videos={disneyVideos} size={"large"} />
          <SectionCards title={"Watch it again"} videos={watchItAgainVideos} size={"small"} />
          <SectionCards title={"Travel"} videos={travelVideos} size={"small"} />
          <SectionCards title={"Productivity"} videos={productivityVideos} size={"medium"} />
          <SectionCards title={"Popular"} videos={popularVideos} size={"small"} />
        </div>
      </div>
    </div>
  );
}
