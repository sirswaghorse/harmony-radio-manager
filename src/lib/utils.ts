
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getEmbedCode(widgetType: string, options: Record<string, any> = {}): string {
  const baseUrl = window.location.origin;
  const optionsStr = Object.entries(options)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return `<iframe 
  src="${baseUrl}/embed/${widgetType}?${optionsStr}" 
  width="100%" 
  height="100%" 
  frameborder="0"
  allow="autoplay"
  style="min-height: ${getWidgetDefaultHeight(widgetType)}px;">
</iframe>`;
}

export function getWidgetDefaultHeight(widgetType: string): number {
  switch (widgetType) {
    case 'player':
      return 100;
    case 'current-song':
      return 80;
    case 'recent-tracks':
      return 200;
    case 'recent-requests':
      return 200;
    case 'current-dj':
      return 120;
    case 'request-song':
      return 300;
    default:
      return 150;
  }
}

