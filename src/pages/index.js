import React, { Suspense } from "react";

import "../styles/style.css";
import { App } from "../components/App";

// markup
const IndexPage = () => {
  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
};

export default IndexPage;
