export const getExtensionFromMimetype = (mimetype: string) => {
  return mimetype.slice(mimetype.lastIndexOf('/') + 1);
};