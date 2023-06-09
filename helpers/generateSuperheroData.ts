import { generateNickname } from "./generateNickname";

export const generateSuperheroData = () => {
  const nickname = generateNickname();
  const real_name = 'real name';
  const origin_description = 'origin description';
  const superpowers = 'superpowers';
  const catch_phrase = 'catch phrase';

  return {
    nickname,
    real_name,
    origin_description,
    superpowers,
    catch_phrase,
  }
};