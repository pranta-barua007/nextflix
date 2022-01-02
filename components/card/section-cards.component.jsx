import Link from "next/link";
import Card from "./card.component";
import clsx from "classnames";
import { useHorizontalScroll } from "../../hooks/useHorizontalScroll";
import styles from "./section-cards.module.css";

const SectionCards = (props) => {
  const { title, videos = [], size, shouldWrap = false, shouldScale } = props;
  const scrollRef = useHorizontalScroll();

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
        <div ref={scrollRef} className={clsx(styles.cardWrapper, shouldWrap && styles.wrap)}>
          {videos.map((video, idx) => {
            return (
              <Link key={idx} href={`/video/${video.id}`}>
                <a>
                  <Card
                    id={idx}
                    imgUrl={video.imgUrl}
                    size={size}
                    shouldScale={shouldScale}
                  />
                </a>
              </Link>
            );
          })}
        </div>
    </section>
  );
};

export default SectionCards;
