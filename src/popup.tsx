import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { fetchContent } from "./fetchHtml";
import { fetchSummary } from "./summary";

const Header = () => (
  <h2 style={{ textAlign: "center", color: "#333" }}>Browser Extension</h2>
);

const InfoList = ({ currentURL }: { currentURL: string | undefined }) => (
  <ul style={{ padding: "0", listStyle: "none" }}>
    <li style={{ marginBottom: "10px" }}>
      <strong>Current URL:</strong> {currentURL || "Loading..."}
    </li>
    <li style={{ marginBottom: "10px" }}>
      <strong>Current Time:</strong> {new Date().toLocaleTimeString()}
    </li>
  </ul>
);

const ActionButtons = ({
  count,
  setCount,
  changeBackground,
  AiSummary,
}: any) => (
  <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
    <button
      onClick={() => setCount(count + 1)}
      style={{
        padding: "10px 20px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Count Up ({count})
    </button>
    <button
      onClick={changeBackground}
      style={{
        padding: "10px 20px",
        backgroundColor: "#28A745",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Change Background
    </button>
    <button
      onClick={AiSummary}
      style={{
        padding: "10px 20px",
        backgroundColor: "#FFC107",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      AI Summary
    </button>
  </div>
);

const ContentDisplay = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => (
  <div style={{ marginBottom: "20px" }}>
    <h4 style={{ color: "#333" }}>{title}:</h4>
    <div
      style={{
        padding: "10px",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "4px",
        maxHeight: "150px",
        overflowY: "auto",
      }}
    >
      {content || "No content available yet."}
    </div>
  </div>
);

const Popup = () => {
  const [count, setCount] = useState(0);
  const [currentURL, setCurrentURL] = useState<string>();
  const [content, setContent] = useState<string>("");
  const [summary, setSummary] = useState<string>("");

  const updateCurrentURL = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentURL(tabs[0].url);
      }
    });
  };

  useEffect(() => {
    updateCurrentURL();

    const handleTabUpdate = (tabId: any, changeInfo: any, tab: any) => {
      if (tab.active && changeInfo.url) {
        setCurrentURL(changeInfo.url);
      }
    };

    const handleTabActivated = (activeInfo: any) => {
      chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url) {
          setCurrentURL(tab.url);
        }
      });
    };

    chrome.tabs.onUpdated.addListener(handleTabUpdate);
    chrome.tabs.onActivated.addListener(handleTabActivated);

    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdate);
      chrome.tabs.onActivated.removeListener(handleTabActivated);
    };
  }, []);

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color: "#555555",
          },
          (msg) => {
            console.log("result message:", msg);
          }
        );
      }
    });
  };

  const AiSummary = async () => {
    if (!currentURL) return;

    const html = await fetchContent(currentURL);
    setContent(html);
    const summaryText = await fetchSummary(html);
    setSummary(summaryText);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#f4f4f4",
        borderRadius: "8px",
        maxWidth: "700px",
      }}
    >
      <Header />
      <InfoList currentURL={currentURL} />
      <ActionButtons
        count={count}
        setCount={setCount}
        changeBackground={changeBackground}
        AiSummary={AiSummary}
      />
      <ContentDisplay title="Content" content={content} />
      <ContentDisplay title="Summary" content={summary} />
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
