import * as motion from "motion/react-client";

import styles from "./EntryBody.module.css";

import Link from "next/link";

const EntryBody = ({ content, link }: { content: string; link: string }) => {
  return (
    <motion.article
      className={`mx-auto max-w-3xl px-5 py-15 ${styles["rich-text"]}`}
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
    >
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
      <div className="mt-5">
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="transition duration-300 ease-in-out hover:text-black/50"
        >
          Visit the site &#8594;
        </Link>
      </div>
    </motion.article>
  );
};

export default EntryBody;
