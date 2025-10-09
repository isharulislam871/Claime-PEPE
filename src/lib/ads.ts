export const LoadAds = async (data: string): Promise<void> => {
  const fnName = `show_${data}`; // e.g., "show_9915087"
  const fn = (window as any)[fnName];

  if (typeof fn !== "function") {
    const errMsg = `❌ Function "${fnName}" not found on window object`;
    console.error(errMsg);
    throw new Error(errMsg);
  }

  try {
    // Call the ad function with 'pop' argument
    await Promise.resolve(fn(''));
    console.log(`✅ ${fnName}('pop') executed successfully`);
  } catch (error) {
    console.error(`🚨 Error executing "${fnName}('pop')":`, error);
    throw error;
  }
};
