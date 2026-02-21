import { useState, useEffect } from 'react';

export const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('matchup-theme');
        return savedTheme || 'light';
    });

    useEffect(() => {
        localStorage.setItem('matchup-theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return { theme, setTheme, toggleTheme };
};
