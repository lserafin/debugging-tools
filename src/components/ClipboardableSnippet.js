import React from "react";
import Clipboard from "react-clipboard.js";

const ClipboardableSnippet = ({ contents }) => {
  return (
    <div className="clipboardable">
      <pre>{contents}</pre>
      <Clipboard
        data-clipboard-text={contents}
        className="clipboard-wrap"
        button-title="Copy to clipboard"
      >
        <i className="mdi mdi-clipboard-text" />
      </Clipboard>
    </div>
  );
};

export default ClipboardableSnippet;
