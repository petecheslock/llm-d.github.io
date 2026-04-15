//import styles from "./styles.module.css"
//import count1URL from '/docs/assets/counting-01.png';


export default function Install() {
  return (
    <>
      {/* ----------------------------- Install Section ---------------------------- */}
      <div className="install viewport" id="install">
        <div className="install-info">
          <div className="install-header">
            <h2 className="install-h1">Explore the Installation Guides</h2>
          </div>

          {/* ----------- Modular Section (copy and paste as many as needed) ---------- */}
          <h3 className="install-h3">
            <img
              //className="llm-d-logo"
              width="50px"
              valign="middle"
              alt="1. "
              src={require('/docs/assets/counting-01.png').default}
              ></img>
            <a className="link" href="docs/guide/Installation/prerequisites">
              Check the Prerequisites
            </a>
          </h3>
          <h3 className="install-h3">
            <img
              //className="llm-d-logo"
              width="50px"
              valign="middle"
              alt="2. "
              src={require('/docs/assets/counting-02.png').default}
              ></img>
            <a className="link" href="docs/guide/Installation">
              Browse Installation Guides
            </a>
          </h3>
          <h3 className="install-h3">
            <img
              //className="llm-d-logo"
              width="50px"
              valign="middle"
              alt="3. "
              src={require('/docs/assets/counting-03.png').default}
              ></img>
              <a className="link" href="docs/guide">Explore llm-d!</a></h3>
          {/* -------------------------------------------------------------------------- */}
        </div>
      </div>
    </>
  );
}
