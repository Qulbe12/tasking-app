import { FileWithPath } from "@mantine/dropzone";

async function convertFileWithPathToFile(fileWithPath: FileWithPath) {
  const arrayBuffer = await fileWithPath.arrayBuffer();
  return new File([arrayBuffer], fileWithPath.name, { type: fileWithPath.type });
}

export default convertFileWithPathToFile;
