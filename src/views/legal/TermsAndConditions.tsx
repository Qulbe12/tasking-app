/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect } from "react";
import getTerms from "../../utils/getTerms";
import { Portal } from "@mantine/core";

const TermsAndConditions = () => {
  useEffect(() => {
    getTerms(document, "script", "termly-jssdk");
  }, []);
  return (
    <Portal>
      {/* @ts-ignore */}
      <div name="termly-embed" data-id="2bccbdd0-2622-4d92-ac15-fa2ad0c242a5"></div>
    </Portal>
  );
};

export default TermsAndConditions;
