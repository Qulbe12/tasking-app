/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Portal } from "@mantine/core";
import React, { useEffect } from "react";
import getTerms from "../../utils/getTerms";

const PrivacyPolicy = () => {
  useEffect(() => {
    getTerms(document, "script", "termly-jssdk");
  }, []);

  return (
    <Portal>
      {/* @ts-ignore */}
      <div name="termly-embed" data-id="70c150a3-78e7-4d43-ac82-db42bd7e421f"></div>
    </Portal>
  );
};

export default PrivacyPolicy;
