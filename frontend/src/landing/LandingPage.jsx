import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";
import Typewriter from "typewriter-effect";

function LandingPage() {
  const [inputValue, setInputValue] = useState("");
  const [inputHeight, setInputHeight] = useState("auto");
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const firstLineTyped = useRef(false);
  const secondLineTyped = useRef(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFadingOut(true);
  };

  const handleButtonClick = (path) => {
    setIsFadingOut(true);
    navigate(path);
  };

  const handleBoxClick = () => {
    document.getElementById("searchInput").focus();
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setInputHeight("auto");
    setInputHeight(`${e.target.scrollHeight}px`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setIsFadingOut(true);
    }
  };

  useEffect(() => {
    const input = document.getElementById("searchInput");
    input.style.caretColor = "transparent";
    input.addEventListener("focus", () => {
      input.style.caretColor = "#fff";
    });
    input.addEventListener("blur", () => {
      input.style.caretColor = "transparent";
    });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSecondLine(true);
    }, 2000); // Adjust the delay as needed

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isFadingOut) {
      const fadeOutTimeout = setTimeout(() => {
        navigate(`/chatbot?input=${encodeURIComponent(inputValue)}`);
      }, 1000); // Adjust the delay to match the CSS transition duration
  
      return () => clearTimeout(fadeOutTimeout);
    }
  }, [isFadingOut, navigate, inputValue]);

  return (
    <>
      <div
        className={`${styles.landingPage} ${isFadingOut ? styles.fadeOut : ""}`}
      >
        <div className={styles.title}>
          <Typewriter
            options={{
              strings: ["Hi Ritesh!"],
              autoStart: true,
              loop: false,
              delay: 75,
              cursor: "",
            }}
            onInit={(typewriter) => {
              if (!firstLineTyped.current) {
                typewriter
                  .typeString("Hi Ritesh!")
                  .callFunction(() => {
                    console.log("First line typed out!");
                    firstLineTyped.current = true;
                  })
                  .start();
              }
            }}
          />
        </div>

        {showSecondLine && (
          <div className={styles.subtitle}>
            <Typewriter
              options={{
                strings: ["What Would You Like To Do Today?"],
                autoStart: true,
                loop: false,
                delay: 75,
                cursor: "|",
              }}
              onInit={(typewriter) => {
                if (!secondLineTyped.current) {
                  typewriter
                    .typeString("What Would You Like To Do Today?")
                    .callFunction(() => {
                      console.log("Second line typed out!");
                      secondLineTyped.current = true;
                    })
                    .start();
                }
              }}
            />
          </div>
        )}

        <div className={styles.searchContainer} onClick={handleBoxClick}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <textarea
              id="searchInput"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type to search..."
              className={styles.input}
              style={{ height: inputHeight }}
            />
          </form>
        </div>

        <div className={styles.buttons}>
          <button
            className={styles.button}
            onClick={() => handleButtonClick("/dashboard")}
          >
            Dashboard
          </button>

          <button
            className={styles.button}
            color="grey"
            variant="faded"
            onClick={() => handleButtonClick("/chatbot")}
          >
            Chat
          </button>
          <button
            className={styles.button}
            color="grey"
            variant="faded"
            onClick={() => handleButtonClick("/study")}
          >
            Study
          </button>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
