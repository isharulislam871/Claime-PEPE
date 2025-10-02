export const LoadAds = (data: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const fnName = `show_${data}`; // e.g., "show_9827587"

    const fn = (window as any)[fnName];

    if (typeof fn === "function") {
      Promise.resolve(fn())
        .then(() => {
          console.log("finished");
          resolve();
        })
        .catch((err) => {
          console.error(`Error running ${fnName}:`, err);
          reject(err);
        });
    } else {
      const errMsg = `Function ${fnName} not found on window`;
      console.error(errMsg);
      reject(new Error(errMsg));
    }
  });
};
