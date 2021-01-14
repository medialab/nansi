export function setGraphInQuery(graphUrl: string): void {
  const currentUrl = new URL(window.location.href);

  currentUrl.searchParams.set('graph', graphUrl);

  window.history.pushState({}, null, currentUrl.href);
}

export function clearGraphFromQuery(): void {
  const currentUrl = new URL(window.location.href);

  if (!currentUrl.searchParams.has('graph')) return;

  currentUrl.searchParams.delete('graph');

  window.history.pushState({}, null, currentUrl.href);
}
