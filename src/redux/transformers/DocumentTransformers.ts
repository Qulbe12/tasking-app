/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createTransform } from "redux-persist";

const DocumentsTransformer = createTransform(
  (inboundState: any, key) => {
    if (key === "documents") {
      const { loaders, ...otherState } = inboundState;
      return otherState;
    }
    return inboundState;
  },

  (outboundState, key) => {
    if (key === "documents") {
      return {
        ...outboundState,
        loaders: {
          adding: null,
          updating: null,
          deleting: null,
          linkingDocument: null,
          addingUser: null,
        },
      };
    }
    return outboundState;
  },
);

export default DocumentsTransformer;
