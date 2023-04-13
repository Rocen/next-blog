import Link from "next/link";
import Image from "next/image";

const Card = ({ date, title, description, slug }) => {
    return (
      <div className="w-full h-full flex items-center">
        <div className="w-full h-full flex flex-col lg:flex-row justify-center items-center">
          <div className="w-48 lg:w-2/5 max-w-full max-h-2/5 p-4">
            <div className="aspect-w-1 aspect-h-1 rounded-xl bg-red-300 mx-auto  shadow-xl">
              <div className="flex justify-center items-center text-lg lg:text-xl text-gray-800 bg-blue-200 text-center font-bold mb-4 p-2 text-ellipsis overflow-hidden">
                {title}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-2/5 h-3/5 lg:h-2/3 px-8 text-center">
            <div className="h-4/5 pb-4 text-ellipsis overflow-hidden">
              <div className="mb-2 lg:mb-12 text-sm text-slate-500 text-ellipsis font-mono text-left overflow-hidden whitespace-pre-wrap">
                {description}
              </div>
              <div className="text-base font-medium italic text-slate-400 mb-4">
                {date}
              </div>
            </div>
            <div className="h-1/5 flex">
              <div className="w-full h-10 py-2 px-4 rounded-lg shadow-md text-white bg-green-500 hover:bg-opacity-70 text-center self-end ">
                <Link href={`/article/${slug}`} passHref>
                  <div className="">PREVIEW</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Card;
  