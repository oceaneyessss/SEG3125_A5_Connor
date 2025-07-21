import React from "react";

export default function LanguageSwitcher({ language, setLanguage }) {
  return (
    <div className="lang-switch">
      <button 
        className={`lang-button ${language === "en" ? "active" : ""}`}
        onClick={() => setLanguage("en")}
        disabled={language === "en"}
      >
        EN
      </button>
      <button 
        className={`lang-button ${language === "fr" ? "active" : ""}`}
        onClick={() => setLanguage("fr")}
        disabled={language === "fr"}
      >
        FR
      </button>
    </div>
  );
}
