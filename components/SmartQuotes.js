import React, { useMemo } from 'react';
import smartquotes from 'smartquotes';

const SmartQuotes = ({ children }) => {
  const processNode = (node) => {
    if (typeof node === 'string') {
      return smartquotes.string(node, {
        apostrophe: true,
        ellipsis: true,
        backticks: false
      });
    }
    if (React.isValidElement(node)) {
      return React.cloneElement(
        node,
        node.props,
        React.Children.map(node.props.children, processNode)
      );
    }
    return node;
  };

  const processedChildren = useMemo(() => {
    return React.Children.map(children, processNode);
  }, [children]);

  return <>{processedChildren}</>;
};

export default SmartQuotes;