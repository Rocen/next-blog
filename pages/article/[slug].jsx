import React from 'react';
import matter from "gray-matter";
import Markdown from "@/components/markdown";
import { getPostSlugs, getPostString } from "@/lib/api";

const Article = ({article}) => {
  return (
    <div className="flex flex-col align-middle">
      <div className="relative h-44 lg:h-80">
        <div className="w-full h-44 lg:h-80 bg-gradient-to-br from-green-300 to-indigo-500" />

        <div className="absolute top-0 left-0 w-full">
          <h1 className="text-slate-50 w-4/5 text-center font-bold  text-lg lg:text-3xl mx-auto mt-10 lg:mt-20">
            {article.meta.title}
          </h1>
        </div>
      </div>

      <div className="w-11/12 lg:max-w-6xl -mt-10 mb-12 z-10 py-8 px-4 lg:px-12 mx-auto bg-gray-100 rounded-xl shadow-xl">
        <Markdown content={article.content} />
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const files = getPostSlugs();
  const paths = files.map((file) => ({
    params: {
      slug: file.split(".")[0],
    },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
}
  
export async function getStaticProps({ ...ctx }) {
  const { slug } = ctx.params;
  const filename = `${slug}.md`;
  const content = getPostString(filename);
  const info = matter(content);
  const article = {
    meta: {
      ...info.data,
      slug,
    },
    content: info.content,
  };

  return {
    props: {
      article: article,
    },
  };
}
  

export default Article;