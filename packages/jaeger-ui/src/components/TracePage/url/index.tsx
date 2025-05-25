// Copyright (c) 2018 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import queryString from 'query-string';

import prefixUrl from '../../../utils/prefix-url';
import { matchPath } from 'react-router-dom';

import { TNil } from '../../../types';

export const ROUTE_PATH = prefixUrl('/trace/:id');

const ROUTE_MATCHER = { path: ROUTE_PATH, end: true, caseSensitive: false };

export function matches(path: string) {
  return Boolean(matchPath(ROUTE_MATCHER, path));
}

export function getUrl(traceID: string, uiFind?: string) {
  const traceUrl = ROUTE_PATH.replace(':id', traceID);
  if (uiFind) {
    return `${traceUrl}?uiFind=${encodeURIComponent(uiFind)}`;
  }
  return traceUrl;
}

export function getLocation(id: string, state: Record<string, string> | TNil, uiFind?: string) {
  return {
    state,
    pathname: getUrl(id),
    search: uiFind && queryString.stringify({ uiFind }),
  };
}

export function parseTraceIdFromUrl(pathname: string): string | null {
  const match = matchPath(ROUTE_MATCHER, pathname);
  return match?.params?.id || null;
}
