import CustomComponent, {
  ProcessNodeContext,
  DomElement
} from "terriajs/lib/ReactViews/Custom/CustomComponent";
import React, { ReactElement } from "react";

function isAllowedSrc(src: string): boolean {
  // YouTube の iframe だけを許可。
  if (
    src.startsWith("https://www.youtube-nocookie.com/") ||
    src.startsWith("https://www.youtube.com/")
  ) {
    return true;
  }
  return false;
}

export default class IframeCutromComponent extends CustomComponent {
  get name() {
    return "iframe";
  }
  get attributes() {
    return [
      "width",
      "height",
      "src",
      "title",
      "frameborder",
      "allow",
      "allowfullscreen"
    ];
  }
  processNode(
    context: ProcessNodeContext,
    node: DomElement
    // children: ReactElement[],
    // index: number
  ): ReactElement | undefined {
    const src = node.attribs?.src;
    if (!isAllowedSrc(src)) {
      return null;
    }
    return (
      <iframe
        width={node.attribs?.width}
        height={node.attribs?.height}
        src={node.attribs?.src}
        title={node.attribs?.title}
        frameBorder={node.attribs?.frameborder}
        allow={node.attribs?.allow}
        allowFullScreen={node.attribs?.allowfullscreen !== undefined}
      />
    );
  }
}
