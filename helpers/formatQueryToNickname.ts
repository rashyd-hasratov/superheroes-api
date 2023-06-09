export const formatQueryToNickname = (query: string) => {
  return query.split('-').join(' ');
};