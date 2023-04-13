import React from 'react';
import Heading from './index';

export default function HeadingBlock(props) {
    const { level, children} = props;
    const renderHtml = () => {
        if (
            children
            && children.length > 0
        ) {
            const nodeValue = children[0];
            return (
                <Heading level={`h${level}`} id={nodeValue}>
                    <a href={`#${nodeValue}`} className="header-anchor text-indigo-500 -ml-3.5 pr-1 opacity-0 hover:opacity-100">
                        #
                    </a>
                    {children}
                </Heading>
            )
        }else {
            return <>{children}</>
        }
    };
    return (
        <>{renderHtml()}</>
    )
};
