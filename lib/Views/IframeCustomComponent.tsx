import CustomComponent, {
  ProcessNodeContext,
  DomElement
} from "terriajs/lib/ReactViews/Custom/CustomComponent";
import React, { ReactElement } from "react";

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
    node: DomElement,
    children: ReactElement[],
    index: number
  ): ReactElement | undefined {
    return <iframe src={node.attribs?.src} />;
  }
}
