import { sectionCollapseSelectorFamily } from "../../state/section-collapse";
import { TaskList, TaskListProps } from "../TaskList";
import { ActGuide } from "../ActGuide";
import styles from "./styles.module.css";
import classNames from "classnames";
import { useLayoutEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useRecoilState } from "recoil";
import { RouteData } from "../../../../common/route-processing/types";
import { getActNumberFromSectionName } from "../../utils/routeZoneExtractor";

interface SectionHolderProps {
  name: string;
  items: TaskListProps["items"];
  section?: RouteData.Section;
}

export function SectionHolder({ name, items, section }: SectionHolderProps) {
  const sectionId = `section-${name.replace(/\s+/g, "_")}`;
  const [collapsed, setCollapsed] = useRecoilState(
    sectionCollapseSelectorFamily(sectionId)
  );

  const scrollToSection = (collapsed: boolean) => {
    if (!collapsed) return;

    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "auto", block: "nearest" });
  };

  useLayoutEffect(() => {
    // scrollToSection after sticky positioning is applied
    scrollToSection(collapsed);
  }, [collapsed]);

  // Extract act number if section is provided
  let actNumber = 1;
  
  if (section) {
    actNumber = getActNumberFromSectionName(name);
  }

  const icon = collapsed ? <FiChevronDown /> : <FiChevronUp />;
  return (
    <div>
      <div id={sectionId} className={classNames(styles.sectionbar)}>
        <button
          aria-label={name}
          className={classNames(styles.header, styles.sectionbarHeader)}
          onClick={() => {
            const updateCollapsed = !collapsed;
            setCollapsed(updateCollapsed);

            // scrollToSection before sticky positioning is applied
            scrollToSection(updateCollapsed);
          }}
        >
          {icon}
          <div>{`--== ${name} ==--`}</div>
          {icon}
        </button>
        <hr />
      </div>
      {collapsed || (
        <>
          <div className={styles.contentContainer}>
            <div className={styles.taskListContainer}>
              <TaskList items={items} />
            </div>
            {section && (
              <div className={styles.zoneGuideContainer}>
                <ActGuide actNumber={actNumber} sectionName={name} />
              </div>
            )}
          </div>
          <hr />
        </>
      )}
    </div>
  );
}
