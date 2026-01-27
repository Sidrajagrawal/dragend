import { useState } from "react";
import "./WhitePaper.css";

const WhitePaper = () => {

  const [openIntro, setOpenIntro] = useState(true);
  const [openStart, setOpenStart] = useState(true);
  const [openCore, setOpenCore] = useState(true);
  const [openOther, setOpenOther] = useState(true);

  return (
    <div className="doc-layout">

      {/* LEFT SIDEBAR */}
      <aside className="doc-sidebar">

        <div className="doc-logo">Dragend Docs</div>

        <div className="doc-menu">

          <h4 className="toc-title">Table of Contents</h4>

          {/* INTRODUCTION */}
          <div className="menu-group">
            <button onClick={() => setOpenIntro(!openIntro)}>
              Introduction
              <span className={openIntro ? "arrow rotate" : "arrow"}>›</span>
            </button>

            {openIntro && (
              <div className="submenu">
                <a href="#intro">Overview</a>
                <a href="#features">Key Features</a>
              </div>
            )}
          </div>

          {/* GETTING STARTED */}
          <div className="menu-group">
            <button onClick={() => setOpenStart(!openStart)}>
              Getting Started
              <span className={openStart ? "arrow rotate" : "arrow"}>›</span>
            </button>

            {openStart && (
              <div className="submenu">
                <a href="#getting">For Developers</a>
                <a href="#workflow">Platform Workflow</a>
              </div>
            )}
          </div>

          {/* CORE MODULES */}
          <div className="menu-group">
            <button onClick={() => setOpenCore(!openCore)}>
              Core Modules
              <span className={openCore ? "arrow rotate" : "arrow"}>›</span>
            </button>

            {openCore && (
              <div className="submenu">
                <a href="#api">API Builder</a>
                <a href="#database">Database Manager</a>
                <a href="#ai">AI Agents</a>
              </div>
            )}
          </div>

          {/* OTHER */}
          <div className="menu-group">
            <button onClick={() => setOpenOther(!openOther)}>
              Other
              <span className={openOther ? "arrow rotate" : "arrow"}>›</span>
            </button>

            {openOther && (
              <div className="submenu">
                <a href="#security">Security</a>
                <a href="#roadmap">Roadmap</a>
                <a href="#faq">FAQs</a>
              </div>
            )}
          </div>

        </div>

      </aside>

      {/* CONTENT */}
      <main className="doc-content">

        <h1>Dragend Whitepaper</h1>
        <p className="doc-subtitle">
          Visual Backend Builder Platform Documentation
        </p>

        <section id="intro">
          <h2>1. Introduction</h2>
          <p>
            Dragend is a visual backend development platform that allows developers to design REST APIs,
            manage databases, and orchestrate AI agents using drag-and-drop workflows.
          </p>
        </section>

        <section id="features">
          <h2>1.1 Key Features</h2>
          <ul>
            <li>Visual workflow builder</li>
            <li>Drag-and-drop API creation</li>
            <li>Database schema management</li>
            <li>AI-powered automation</li>
            <li>Production-ready deployment support</li>
          </ul>
        </section>

        <section id="getting">
          <h2>2. Getting Started</h2>
          <p>
            Developers can create backend workflows using visual components and connect them on the
            canvas workspace.
          </p>
        </section>

        <section id="workflow">
          <h2>2.1 Platform Workflow</h2>
          <p>
            Users design backend logic by dragging API nodes, database blocks, and automation components
            into the workflow canvas.
          </p>
        </section>

        <section id="api">
          <h2>3. Visual API Builder</h2>
          <p>
            Dragend allows creation of REST APIs using HTTP methods such as GET, POST, PUT, PATCH and DELETE.
          </p>
        </section>

        <section id="database">
          <h2>3.1 Database Management</h2>
          <p>
            Developers can visually design database schemas and manage data relationships.
          </p>
        </section>

        <section id="ai">
          <h2>3.2 AI Agent System</h2>
          <p>
            AI agents help automate backend decision-making and data processing tasks.
          </p>
        </section>

        <section id="security">
          <h2>4. Security</h2>
          <p>
            Dragend includes authentication layers, API validation, role-based access control and secure
            data handling mechanisms.
          </p>
        </section>

        <section id="roadmap">
          <h2>5. Roadmap</h2>
          <p>
            Planned upgrades include cloud deployment automation, AI workflow optimization and enterprise
            integrations.
          </p>
        </section>

        {/* FAQ SECTION */}
        <section id="faq">
          <h2>6. FAQs</h2>

          <h4>Is Dragend suitable for production use?</h4>
          <p>Yes, Dragend is built to support scalable production workloads.</p>

          <h4>Can beginners use Dragend?</h4>
          <p>Yes, the platform is designed to be beginner-friendly while still supporting advanced users.</p>

          <h4>Does Dragend replace backend developers?</h4>
          <p>No, it improves productivity but does not replace core development logic.</p>

          <h4>Is coding knowledge required?</h4>
          <p>Basic backend understanding helps, but most workflows can be built visually.</p>

          <h4>Can Dragend integrate with existing systems?</h4>
          <p>Yes, Dragend supports API integrations and external service connections.</p>

        </section>

      </main>

    </div>
  );
};

export default WhitePaper;