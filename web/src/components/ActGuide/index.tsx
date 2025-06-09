import { useState, useEffect } from "react";
import { marked } from "marked";
import styles from "./styles.module.css";
import { FiBook, FiMap } from "react-icons/fi";

interface ActGuideProps {
  actNumber: number;
  sectionName?: string;
}

export function ActGuide({ actNumber, sectionName }: ActGuideProps) {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadActMarkdown() {
      try {
        // Check if this is the pre-act section (Act 0 or section name contains introduction/disclaimer)
        const isPreAct = actNumber === 0 || sectionName?.toLowerCase().includes('pre-act') || sectionName?.toLowerCase().includes('introduction') || sectionName?.toLowerCase().includes('disclaimer');
        const filename = isPreAct ? 'disclaimer.md' : `act${actNumber}.md`;
        
        // Load the specific markdown file
        const response = await fetch(`/poe1-campaign-helper/docs/${filename}`);
        if (!response.ok) {
          throw new Error(`Failed to load ${isPreAct ? 'disclaimer' : `Act ${actNumber}`} data`);
        }
        
        const content = await response.text();
        
        // Extract base64 image definitions from the markdown
        const imageDefinitions: Record<string, string> = {};
        const imageDefRegex = /\[image(\d+)\]:\s*<(data:image\/[^>]+)>/g;
        let match;
        while ((match = imageDefRegex.exec(content)) !== null) {
          imageDefinitions[match[1]] = match[2];
        }
        
        // Convert image references to HTML images using base64 data
        const contentWithImages = content.replace(
          /!\[\]\[image(\d+)\]/g, 
          (fullMatch, imageNumber) => {
            const base64Data = imageDefinitions[imageNumber];
            if (base64Data) {
              return `<img src="${base64Data}" alt="Zone layout" />`;
            }
            return fullMatch; // Keep original if no base64 data found
          }
        );
        
        // Parse markdown to HTML
        const htmlContent = marked(contentWithImages);
        setMarkdownContent(htmlContent);
      } catch (err) {
        const isPreAct = actNumber === 0 || sectionName?.toLowerCase().includes('pre-act') || sectionName?.toLowerCase().includes('introduction') || sectionName?.toLowerCase().includes('disclaimer');
        console.error(`Error loading ${isPreAct ? 'disclaimer' : `Act ${actNumber}`} data:`, err);
        setError(`Failed to load ${isPreAct ? 'disclaimer' : `Act ${actNumber}`} information`);
      } finally {
        setLoading(false);
      }
    }

    loadActMarkdown();
  }, [actNumber, sectionName]);

  const isPreAct = actNumber === 0 || sectionName?.toLowerCase().includes('pre-act') || sectionName?.toLowerCase().includes('introduction') || sectionName?.toLowerCase().includes('disclaimer');
  
  if (loading) {
    return (
      <div className={styles.actGuide}>
        <div className={styles.header}>
          <FiMap className={styles.icon} />
          <span>Loading {isPreAct ? 'guide introduction' : `Act ${actNumber} guide`}...</span>
        </div>
      </div>
    );
  }

  if (error || !markdownContent) {
    return (
      <div className={styles.actGuide}>
        <div className={styles.header}>
          <FiBook className={styles.icon} />
          <span>{isPreAct ? 'Guide introduction' : `Act ${actNumber} guide`} unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.actGuide}>
      <div className={styles.header}>
        <FiMap className={styles.icon} />
        <span>{isPreAct ? 'Guide Introduction & Disclaimer' : `Act ${actNumber} Layout Guide`}</span>
      </div>
      
      <div className={styles.content}>
        {!isPreAct && (
          <div className={styles.disclaimer}>
            <strong>Zone Layout Cheat Sheet</strong>
            <p>Layout information from Engineering Eternity's guides. Layouts may vary.</p>
          </div>
        )}
        
        <div 
          className={styles.markdown}
          dangerouslySetInnerHTML={{ __html: markdownContent }}
        />
        
        {!isPreAct && (
          <div className={styles.footer}>
            <small>
              For detailed video guides, check out{' '}
              <a 
                href="https://www.youtube.com/channel/UCaFHfrY-6uGSAvmczp_7a6Q" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.link}
              >
                Engineering Eternity's channel
              </a>
            </small>
          </div>
        )}
      </div>
    </div>
  );
} 