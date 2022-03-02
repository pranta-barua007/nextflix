import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Modal from "react-modal";
import clsx from "classnames";
import NavBar from "../../components/navbar/navbar.component";
import Like from "../../components/icon/like-icon.component";
import Dislike from "../../components/icon/dislike-icon.component";

import { getYoutubeVideoById } from "../../lib/videos";

import styles from "../../styles/Video.module.css";

Modal.setAppElement("#__next");

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps(context) {
  const videoId = context.params.videoId;
  const videoArray = await getYoutubeVideoById(videoId);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
  const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"];
  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
}

const Video = ({ video }) => {
  const router = useRouter();
  const videoId = router.query.videoId;
  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDislike, setToggleDislike] = useState(false);
  const { title, publishTime, description, channelTitle, viewCount } = video;

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
      });
      const data = await response.json();
     
      if(data.length > 0) {
        const favourited = data[0].favourited;
        if(favourited === 1) {
          setToggleLike(true)
        } else if(favourited === 0) {
          setToggleDislike(true)
        }
      }
    } 

    fetchStats();
  }, []);

  const runRatingService = async (favourited) => {
    return await fetch('/api/stats', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        videoId,
        favourited
      })
    });
  }

  const handleToogleLike = async () => {
    const val = !toggleLike;
    setToggleLike(val);
    setToggleDislike(toggleLike);

    const favourited = val ? 1 : 0;
    await runRatingService(favourited);
  }

  const handleToogleDislike = async () => {
    setToggleDislike(!toggleDislike);
    setToggleLike(toggleDislike);

    const val = !toggleDislike;
    const favourited = val ? 0 : 1;
    await runRatingService(favourited);
  }

  return (
    <div className={styles.conatainer}>
      <NavBar />
      <Modal
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={() => router.back()}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id="player"
          className={styles.videoPlayer}
          type="text/html"
          width="100%"
          height="390"
          src={`http://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=http://example.com&rel=0`}
          frameBorder="0"
        ></iframe>
        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToogleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike}/>
              </div>
            </button>
          </div>
          <button onClick={handleToogleDislike}>
            <div className={styles.btnWrapper}>
              <Dislike selected={toggleDislike} />
            </div>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
