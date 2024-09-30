export function getCollectWord() {
  const data = localStorage.getItem("collectWord");
  if (!data) {
    return [];
  }else {
    return JSON.parse(data);
  }
}

export function setCollectWord(data) {
  localStorage.setItem("collectWord", JSON.stringify(data));
}

export function clearCollectWord() {
  localStorage.removeItem("collectWord");
}
