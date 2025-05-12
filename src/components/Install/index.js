//import styles from "./styles.module.css"

export default function Install() {
  return (
    <>
      {/* ----------------------------- Install Section ---------------------------- */}
      <div className="install viewport" id="install">
        <div className="install-info">
          <div className="install-header">
            <h1 className="install-h1">Try the Quickstart Demo </h1>
            <img
            width={"20%"}
              className="install-logo"
              src="img/llm-d-logotype.svg"
              alt="llm-d"
            ></img>
          </div>
          <h2 className="install-h2">Want to kick the tires?<br/>It's as easy as 1...2...llm-d!</h2>

          {/* ----------- Modular Section (copy and paste as many as needed) ---------- */}
          <h3 className="install-h3">
            <a className="link" href="docs/guide/installation/quickstart#hardware-profiles">
              1. Check the Prerequisites
            </a>
          </h3>
          <h3 className="install-h3">
            <a className="link" href="docs/guide/installation/quickstart#llm-d-installation">
              2. Run the Quickstart
            </a>
          </h3>
          <h3 className="install-h3">3. Explore llm-d!</h3>
          {/* -------------------------------------------------------------------------- */}
          <button className="static-button" role="button" href="#">
            <a className="button-link" href="docs/guide">
              Complete installation methods are in the user guide
            </a>
          </button>
        </div>
      </div>
    </>
  );
}
