import { v4 } from "uuid"

export const generateNickname = () => {
  return v4().split('-').join(' ');
};