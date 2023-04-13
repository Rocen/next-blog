import matter from "gray-matter";
import Card from "@/components/card";
import { getPostSlugs, getPostString } from "@/lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Scrollbar, A11y, Mousewheel } from "swiper";

function Home({articles}) {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-200 to-gray-500 flex shadow-xl">
      <Swiper
        className="p-6 w-10/12 lg:w-3/5 h-3/4 lg:h-2/4 m-auto bg-white rounded-xl shadow-lg"
        spaceBetween={30}
        effect="fade"
        mousewheel={true}
        direction={"vertical"}
        modules={[Pagination, Navigation, Scrollbar, A11y, Mousewheel]}
        pagination={{ clickable: true, type: "bullets" }}
        scrollbar={{ draggable: true }}
        navigation
      >
        {articles.map((article, index) => (
          <SwiperSlide key={index} className="">
            <Card
              date={article.date}
              title={article.title}
              description={article.description}
              slug={article.slug}
              />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export const getStaticProps = async () => {
  const files = getPostSlugs();

  const posts = files.map((filename) => {
    const markdownWithMeta = getPostString(filename);
    const { data } = matter(markdownWithMeta);

    return {
      ...data,
      slug: filename.split(".")[0],
    };
  });

  return {
    props: {
      articles: posts,
    },
  };
};

export default Home;