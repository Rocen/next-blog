import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import HeadingBlock from "../Heading/block";

const Markdown = ({ content }) => {
    const components = {
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
  
        return !inline && match ? (
          // @ts-expect-error: Let's ignore a compile error like this unreachable code 
          <SyntaxHighlighter
            style={materialDark}
            PreTag="div"
            language={match[1]}
            children={String(children).replace(/\n$/, "")}
            {...props}
          />
        ) : (
          <code className={className ? className : ""} {...props}>
            {children}
          </code>
        );
      },
      h1: HeadingBlock,
      h2: HeadingBlock
    };
  
    return (
      <article className="prose prose-sm lg:prose-md">
        <ReactMarkdown
          components={components}
          children={content}
          remarkPlugins={[remarkGfm]}
        />
      </article>
    );
  };
  
  export default Markdown;