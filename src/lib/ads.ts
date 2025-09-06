export const LoadAds = (data : string) => {
    
  const fnName = `show_${data}`; // → "show_9827587"

  if (typeof (window as any)[fnName] === "function") {
    (window as any)[fnName]().then(() => {
      console.log("finished");
    });
  } else {
    console.error(`Function ${fnName} not found on window`);
  }
}