import { formStyles } from "../../styles";
import { UrlRewriter, fetchStringOrUrl, getRewriteUrl } from "../../utility";
import { TextModal } from "../Modal";
import { PobData, processPob } from "./pob";
import styles from "./styles.module.css";
import classNames from "classnames";
import { useState } from "react";
import { toast } from "react-toastify";

const URL_REWRITERS: UrlRewriter[] = [
  (url) => {
    const match = /pastebin\.com\/(.+)$/.exec(url);
    if (!match) return null;

    return `pastebin.com/raw/${match[1]}`;
  },
  (url) => {
    const match = /poe\.ninja\/pob\/(.+)$/.exec(url);
    if (!match) return null;

    return `poe.ninja/pob/raw/${match[1]}`;
  },
  (url) => {
    const match = /pobb\.in\/(.+)$/.exec(url);
    if (!match) return null;

    return `pobb.in/${match[1]}/raw`;
  },
  (url) => {
    const match = /youtube.com\/redirect\?.+?q=(.+?)(?:&|$)/.exec(url);
    if (!match) return null;
    const redirectUrl = decodeURIComponent(match[1]);

    return getRewriteUrl(redirectUrl, URL_REWRITERS);
  },
];

interface BuildImportFormProps {
  onSubmit: (pobData: PobData, pobCode: string) => void;
  onReset: () => void;
}

export function BuildImportForm({ onSubmit, onReset }: BuildImportFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TextModal
        label="Path of Building Code"
        size="small"
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        onSubmit={(pobCodeOrUrl) =>
          toast.promise(
            async () => {
              if (!pobCodeOrUrl) return Promise.reject("invalid pobCodeOrUrl");
              const pobCode = await fetchStringOrUrl(
                pobCodeOrUrl,
                URL_REWRITERS
              );

              const pobData = processPob(pobCode);
              if (!pobData) return Promise.reject("parsing failed");

              onSubmit(pobData, pobCode);
            },
            {
              pending: "Importing Build",
              success: "Import Success",
              error: "Import Failed",
            }
          )
        }
      />
      <div className={classNames(styles.buttonContainer)}>
        <button
          className={classNames(formStyles.formButton, styles.resetButton)}
          onClick={() => {
            onReset();
          }}
        >
          Reset Build
        </button>
        <button
          className={classNames(formStyles.formButton, styles.importButton)}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Import Build
        </button>
      </div>
    </>
  );
}
