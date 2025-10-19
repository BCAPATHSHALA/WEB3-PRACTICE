export const formatBalance = (balance: number, decimals = 2): string => {
  return balance.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

export const balanceToDisplay = (
  value: string | number,
  decimals: number
): string => {
  const num = typeof value === "string" ? Number.parseFloat(value) : value;
  return (num / Math.pow(10, decimals)).toFixed(decimals);
};
