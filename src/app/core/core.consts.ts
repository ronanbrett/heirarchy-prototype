import { environment } from '../../environments/environment';

export function apiBasePath() {
  if (document) {
    return `//${environment.apiBase}`;
  }
}
