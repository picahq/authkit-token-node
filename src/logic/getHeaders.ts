export const getHeaders = (secret: string) => {
  return {
    'X-Pica-Secret': secret,
    'Content-Type': 'application/json',
  };
};
