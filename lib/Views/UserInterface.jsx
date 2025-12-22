import PropTypes from "prop-types";
import React from "react";
import RelatedMaps from "terriajs/lib/ReactViews/RelatedMaps/RelatedMaps";
import {
  ExperimentalMenu,
  MenuLeft
} from "terriajs/lib/ReactViews/StandardUserInterface/customizable/Groups";
import MenuItem from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuItem";
import StandardUserInterface from "terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface";
import version from "../../version";
import "./global.scss";

export default function UserInterface(props) {
  const relatedMaps = props.viewState.terria.configParameters.relatedMaps;

  return (
    <StandardUserInterface {...props} version={version}>
      <MenuLeft></MenuLeft>
      <ExperimentalMenu />
    </StandardUserInterface>
  );
}

UserInterface.propTypes = {
  terria: PropTypes.object,
  viewState: PropTypes.object
};
