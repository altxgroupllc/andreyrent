"use client";

import * as React from "react";

export function StudioIntro() {
  const [leaving, setLeaving] = React.useState(false);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    document.documentElement.classList.add("studio-intro-open");

    const leaveTimer = window.setTimeout(() => setLeaving(true), 1120);
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      document.documentElement.classList.remove("studio-intro-open");
    }, 1420);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
      document.documentElement.classList.remove("studio-intro-open");
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`studio-intro${leaving ? " studio-intro-leaving" : ""}`}
      aria-label="Created by ALTX Studio"
    >
      <div className="studio-intro-lockup">
        <p className="studio-intro-credit">Created by <strong>ALTX Studio</strong></p>
        <div className="studio-intro-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
