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

import React, { ReactNode, createContext, useContext, FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Create a history-like interface for React Router v6
interface HistoryLike {
  push: (path: string) => void;
  replace: (path: string) => void;
  go: (delta: number) => void;
  goBack: () => void;
  goForward: () => void;
  location: ReturnType<typeof useLocation>;
}

const HistoryContext = createContext<HistoryLike | undefined>(undefined);

interface IHistoryProviderProps {
  children: ReactNode;
}

export const useHistory = (): HistoryLike => {
  const context = useContext(HistoryContext);
  if (!context) {
    // Fallback for components not wrapped in HistoryProvider
    const navigate = useNavigate();
    const location = useLocation();
    
    return {
      push: navigate,
      replace: (path: string) => navigate(path, { replace: true }),
      go: (delta: number) => window.history.go(delta),
      goBack: () => window.history.back(),
      goForward: () => window.history.forward(),
      location,
    };
  }
  return context;
};

export const HistoryProvider: FC<IHistoryProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Create history-like object using React Router v6 hooks
  const historyLike: HistoryLike = {
    push: navigate,
    replace: (path: string) => navigate(path, { replace: true }),
    go: (delta: number) => window.history.go(delta),
    goBack: () => window.history.back(),
    goForward: () => window.history.forward(),
    location,
  };

  return <HistoryContext.Provider value={historyLike}>{children}</HistoryContext.Provider>;
};