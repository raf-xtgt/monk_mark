import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
    showTopBar: boolean;
    showBottomNavigation: boolean;
    setShowTopBar: (show: boolean) => void;
    setShowBottomNavigation: (show: boolean) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within AppStateProvider');
    }
    return context;
};

interface AppStateProviderProps {
    children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
    const [showTopBar, setShowTopBar] = useState(true);
    const [showBottomNavigation, setShowBottomNavigation] = useState(true);

    const value: AppState = {
        showTopBar,
        showBottomNavigation,
        setShowTopBar,
        setShowBottomNavigation,
    };

    return (
        <AppStateContext.Provider value={value}>
            {children}
        </AppStateContext.Provider>
    );
};
