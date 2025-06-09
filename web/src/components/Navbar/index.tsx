import { useClearGemProgress } from "../../state/gem-progress";
import { useClearRouteProgress } from "../../state/route-progress";
import { useClearCollapseProgress } from "../../state/section-collapse";
import styles from "./styles.module.css";
import classNames from "classnames";
import React from "react";
import {
  FaMap,
  FaTools,
  FaUndoAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface NavbarButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

function NavbarButton({ label, icon, onClick }: NavbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(styles.navButton)}
    >
      {icon}
      {label}
    </button>
  );
}

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  const navigate = useNavigate();

  const clearRouteProgress = useClearRouteProgress();
  const clearGemProgress = useClearGemProgress();
  const clearCollapseProgress = useClearCollapseProgress();

  return (
    <div className={classNames(styles.navbar)}>
      <div className={classNames(styles.navContainer)}>
        <NavbarButton
          label="Route"
          icon={<FaMap className={classNames("inlineIcon")} />}
          onClick={() => {
            navigate("/");
          }}
        />
        <NavbarButton
          label="Build"
          icon={<FaTools className={classNames("inlineIcon")} />}
          onClick={() => {
            navigate("/build");
          }}
        />
        <NavbarButton
          label="Reset Progress"
          icon={<FaUndoAlt className={classNames("inlineIcon")} />}
          onClick={() => {
            clearRouteProgress();
            clearGemProgress();
            clearCollapseProgress();
          }}
        />
      </div>
      <hr />
    </div>
  );
}


