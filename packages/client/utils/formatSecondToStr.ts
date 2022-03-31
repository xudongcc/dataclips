export const formatSecondToStr = (seconds: number) => {
  const daySec = 24 * 60 * 60;
  const hourSec = 60 * 60;
  const minuteSec = 60;

  const dd = Math.floor(seconds / daySec);
  const hh = Math.floor((seconds % daySec) / hourSec);
  const mm = Math.floor((seconds % hourSec) / minuteSec);
  const ss = seconds % minuteSec;

  if (dd > 0) {
    return `${dd} 天 ${String(hh).padStart(2, "0")} 小时 ${String(mm).padStart(
      2,
      "0"
    )} 分钟 ${String(ss).padStart(2, "0")} 秒`;
  }

  if (hh > 0) {
    return `${hh} 小时 ${String(mm).padStart(2, "0")} 分钟 ${String(
      ss
    ).padStart(2, "0")} 秒`;
  }

  if (mm > 0) {
    return `${mm} 分钟 ${String(ss).padStart(2, "0")} 秒`;
  }

  return `${ss} 秒`;
};
