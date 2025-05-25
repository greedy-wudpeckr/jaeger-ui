// Copyright (c) 2023 The Jaeger Authors.
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

import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useHistory } from './useHistory';

function withRouteProps(Component: React.ComponentType<any>) {
  return function WrappedComponent(props: Record<string, unknown>) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const history = useHistory();

    // Ensure params is never undefined - CRITICAL FIX
    const safeParams = params || {};

    //   if (location.pathname.includes('/trace/')) {
    //   console.log('🚨 withRouteProps CRITICAL DEBUG:', {
    //     fullPathname: location.pathname,
    //     reactRouterParams: params,
    //     paramsKeys: Object.keys(params || {}),
    //     paramsValues: Object.values(params || {}),
    //     directIdParam: params?.id,
    //     manualExtraction: location.pathname.split('/')[2], // Should be the trace ID
    //     componentName: Component.displayName || Component.name,
    //   });
    // }

    // Create router props object similar to v5 but with safe params
    const routerProps = {
      location,
      navigate,
      history,
      match: {
        params: safeParams,  // Use safe params here
      },
      // Also provide params directly for backward compatibility
      params: safeParams,
    };

    return <Component {...props} {...routerProps} />;
  };
}

export default withRouteProps;