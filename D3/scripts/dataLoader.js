export function loadGraphData(url) {
  return fetch(url)
    .then(response => response.json());
}
