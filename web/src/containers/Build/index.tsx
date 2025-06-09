import { BuildImportForm } from "../../components/BuildImportForm";
import { BuildInfoForm } from "../../components/BuildInfoForm";
import { ConfigForm } from "../../components/ConfigForm";
import { GemEditForm } from "../../components/GemEditForm";
import { SearchStringsEditor } from "../../components/SearchStringsEditor";
import { buildDataSelector } from "../../state/build-data";
import { configSelector } from "../../state/config";
import { requiredGemsSelector } from "../../state/gem";
import { gemLinksSelector } from "../../state/gem-links";
import { pobCodeAtom } from "../../state/pob-code";
import { buildTreesSelector } from "../../state/tree/build-tree";
import { formStyles } from "../../styles";
import classNames from "classnames";
import { useRecoilState, useResetRecoilState } from "recoil";

export default function BuildContainer() {
  const [config, setConfig] = useRecoilState(configSelector);

  const [buildData, setBuildData] = useRecoilState(buildDataSelector);
  const resetBuildData = useResetRecoilState(buildDataSelector);

  const [requiredGems, setRequiredGems] = useRecoilState(requiredGemsSelector);
  const resetRequiredGems = useResetRecoilState(requiredGemsSelector);

  const [, setBuildTreesSelector] = useRecoilState(buildTreesSelector);
  const resetBuildTreesSelector = useResetRecoilState(buildTreesSelector);

  const [, setGemLinks] = useRecoilState(gemLinksSelector);
  const resetGemLinks = useResetRecoilState(gemLinksSelector);

  const [, setPobCode] = useRecoilState(pobCodeAtom);
  const resetPobCode = useResetRecoilState(pobCodeAtom);

  return (
    <div>
      <BuildInfoForm
        buildData={buildData}
        onSubmit={(buildData) => {
          setBuildData(buildData);
        }}
      />
      <hr />
      <ConfigForm
        config={config}
        onSubmit={(config) => {
          setConfig(config);
        }}
      />
      <hr />
      <div className={classNames(formStyles.form)}>
        <SearchStringsEditor />
        <div className={classNames(formStyles.formRow)}>
          <label>Find League Starter Builds</label>
          <div style={{ padding: '0.5rem', background: '#2a2a2a', borderRadius: '4px', border: '1px solid #333' }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#bbb', fontSize: '0.9rem' }}>
              <strong>📋 How to use PoB Archives:</strong>
            </p>
            <ol style={{ margin: '0 0 0.75rem 1.25rem', color: '#ddd', fontSize: '0.85rem', lineHeight: '1.4' }}>
              <li>Visit <a href="https://pobarchives.com/builds/B44DWJ7P?sort=dps" target="_blank" rel="noopener noreferrer" style={{ color: '#66b3ff', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold' }}>PoB Archives - League Starter Builds</a></li>
              <li>Use the <strong style={{ color: '#ffa366' }}>Content</strong> filter to find builds suitable for your playstyle</li>
              <li>Click on a build that interests you</li>
              <li>Go to the <strong style={{ color: '#ffa366' }}>Download</strong> section</li>
              <li>Copy the <strong style={{ color: '#ffa366' }}>PoB code</strong> and paste it in the Import Build section below</li>
            </ol>
            <p style={{ margin: '0', color: '#888', fontSize: '0.75rem', fontStyle: 'italic' }}>
              💡 Tip: Look for builds tagged as "League Starter" for budget-friendly options
            </p>
          </div>
        </div>
        <BuildImportForm
          onSubmit={(pobData, pobCode) => {
            setBuildData(pobData.buildData);
            setRequiredGems(pobData.requiredGems);
            setBuildTreesSelector(pobData.buildTrees);
            setGemLinks(pobData.gemLinks);
            setPobCode(pobCode);
          }}
          onReset={() => {
            resetBuildData();
            resetRequiredGems();
            resetBuildTreesSelector();
            resetGemLinks();
            resetPobCode();
          }}
        />
      </div>
      <hr />
      {requiredGems.length > 0 && (
        <>
          <GemEditForm
            requiredGems={requiredGems}
            onUpdate={(requiredGems) => {
              setRequiredGems(requiredGems);
            }}
          />
          <hr />
        </>
      )}
    </div>
  );
}
