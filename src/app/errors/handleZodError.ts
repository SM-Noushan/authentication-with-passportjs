import z, { ZodError } from "zod";
import { TErrorSource, TGenericErrorResponse } from "../interface/error";

type TTreeError = {
  errors: string[];
  properties?: {
    [key: string]: TTreeError;
  };
};

const handleZodError = (error: ZodError): TGenericErrorResponse => {
  const statusCode = 400;
  const treeError: TTreeError = z.treeifyError(error);
  const errorObj = treeError?.properties?.body?.properties || {};

  const errorSources: TErrorSource = Object.keys(errorObj)
    .sort()
    .map(key => {
      return {
        path: key,
        message: errorObj[key].errors?.join(", ") || "Unknown error",
      };
    });

  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};

export default handleZodError;
