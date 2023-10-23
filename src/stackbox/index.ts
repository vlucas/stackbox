// CONTENT
export type TDict = {
  [key: string]: string | number;
};
export type TSBContentTextObject = {
  text: string;
  children: Array<TSBContentBlock | TSBContentTextObject> | undefined;
  styles: TDict;
};
export type TSBBlockParagraph = {
  content: TSBContentTextObject;
};
export type TSBContentBlock = {
  type: string;
  children: Array<TSBContentBlock | TSBContentTextObject> | undefined;
  styles?: TDict;
};
export type TSBJSONFormat = {
  id: string;
  blocks: TSBContentBlock[];
};
