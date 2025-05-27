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
import { matchPath } from 'react-router-dom';


import prefixUrl from '../../utils/prefix-url';

export type TDiffRouteParams = {
  a?: string | undefined;
  b?: string | undefined;
};

export const ROUTE_PATH = prefixUrl('/trace/:a?/:b?');


const ROUTE_MATCHER = { path: ROUTE_PATH, end: true, caseSensitive: false };

export function matches(path: string) {
  return Boolean(matchPath(ROUTE_MATCHER, path));
}

export function getUrl(data?: { cohort?: string[] } | null) {
  const search = data && data.cohort && data.cohort.length >= 2 
    ? queryString.stringify({ cohort: data.cohort[0] }) 
    : '';
    
  const a = data?.cohort?.[0] || '';
  const b = data?.cohort?.[1] || '';
  
  // CRITICAL FIX: Remove literal "..." from URL generation
  if (!a && !b) {
    return prefixUrl('/trace/'); // Fallback route for empty diff
  }
  
  return prefixUrl(`/trace/${a}/${b}${search ? '?' : ''}${search}`);
}