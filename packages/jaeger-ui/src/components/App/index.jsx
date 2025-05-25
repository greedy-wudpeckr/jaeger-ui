// Copyright (c) 2017 Uber Technologies, Inc.
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
import { Provider } from 'react-redux';
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';

import { ConfigProvider } from 'antd';
import { defaultTheme } from '@ant-design/compatible';
import NotFound from './NotFound';
import Page from './Page';
import DependencyGraph from '../DependencyGraph';
import { ROUTE_PATH as dependenciesPath } from '../DependencyGraph/url';
import DeepDependencies from '../DeepDependencies';
import { ROUTE_PATH as deepDependenciesPath } from '../DeepDependencies/url';
import QualityMetrics from '../QualityMetrics';
import { ROUTE_PATH as qualityMetricsPath } from '../QualityMetrics/url';
import SearchTracePage from '../SearchTracePage';
import { ROUTE_PATH as searchPath } from '../SearchTracePage/url';
import TraceDiff from '../TraceDiff';
import { ROUTE_PATH as traceDiffPath } from '../TraceDiff/url';
import TracePage from '../TracePage';
import { ROUTE_PATH as tracePath } from '../TracePage/url';
import MonitorATMPage from '../Monitor';
import { ROUTE_PATH as monitorATMPath } from '../Monitor/url';
import JaegerAPI, { DEFAULT_API_ROOT } from '../../api/jaeger';
import processScripts from '../../utils/config/process-scripts';
import prefixUrl from '../../utils/prefix-url';

import '../common/vars.css';
import '../common/utils.css';
import 'antd/dist/reset.css';
import './index.css';
import { store } from '../../utils/configure-store';
import { HistoryProvider } from '../../utils/useHistory';

const jaegerTheme = {
  token: {
    ...defaultTheme.token,
    colorPrimary: '#199',
  },
  components: {
    ...defaultTheme.components,
    Layout: {
      ...defaultTheme.components.Layout,
      bodyBg: '#fff',
      headerBg: '#404040',
      footerBg: '#fff',
      headerHeight: 48,
      headerPadding: '0 50',
      footerPadding: '24 50',
      siderBg: '#404040',
      triggerHeight: 48,
      triggerBg: 'tint(#fff, 20%)',
      zeroTriggerWidth: 36,
      zeroTriggerHeight: 42,
    },
    Menu: {
      ...defaultTheme.components.Menu,
      darkItemBg: '#151515',
    },
    Table: {
      ...defaultTheme.components.Table,
      rowHoverBg: '#e5f2f2',
    },
  },
};

// CRITICAL FIX: Convert to functional component for React Router v6
function JaegerUIApp() {
  React.useEffect(() => {
    JaegerAPI.apiRoot = DEFAULT_API_ROOT;
    processScripts();
  }, []);

  // DEBUG: Log route paths to identify conflicts
  console.log('🔍 DEBUG App Route Paths:', {
    searchPath,
    tracePath,
    traceDiffPath,
    dependenciesPath,
    deepDependenciesPath,
    qualityMetricsPath,
    monitorATMPath,
  });

  return (
    <ConfigProvider theme={jaegerTheme}>
      <Provider store={store}>
          <HistoryProvider>
            <Page>
              <Routes>
                <Route path={searchPath} element={<SearchTracePage />} />
                
                {/* CRITICAL FIX: Most specific routes first */}
                <Route path={tracePath} element={<TracePage />} />
                <Route path={traceDiffPath} element={<TraceDiff />} />
                
                
                <Route path={dependenciesPath} element={<DependencyGraph />} />
                <Route path={deepDependenciesPath} element={<DeepDependencies />} />
                <Route path={qualityMetricsPath} element={<QualityMetrics />} />
                <Route path={monitorATMPath} element={<MonitorATMPage />} />

                <Route path="/" element={<Navigate to={searchPath} replace />} />
                <Route path={prefixUrl()} element={<Navigate to={searchPath} replace />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Page>
          </HistoryProvider>
      </Provider>
    </ConfigProvider>
  );
}

export default JaegerUIApp;