import {useEffect, useRef, useState} from "react";
import {styles} from "./styles";

function StockSearchBar({ watchlistData, onAddStock , userId, APIServer}) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isAlreadyInWatchlist, setIsAlreadyInWatchlist] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const searchTimeout = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const searchStocks =  async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        setIsLoading(true);
        setNotFound(false);
        setIsAlreadyInWatchlist(false);
        setShowDropdown(true);

        const watchlistSymbols = new Set(watchlistData.map((stock) => stock.symbol));
        if(watchlistSymbols.has(searchQuery)) {
            setIsAlreadyInWatchlist(true);
            return;
        }

        let resultsArray = [];
        try {
            const response = await fetch(`${APIServer}/stocks?query=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) {
                const clone = response.clone();
                const errorText = await clone.text();
                throw new Error(errorText);
            }

            const data = await response.json();
            console.log(data);

            resultsArray = Array.isArray(data) ? data : [data];

        } catch (error) {
            console.error(error);
            setResults([]);
        }

        setResults(resultsArray);
        // setShowDropdown(resultsArray.length > 0);
        setNotFound(resultsArray.length <= 0);

        setIsLoading(false);

    };

    const  handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            searchStocks(value);
        }, 300);
    };

    const handleSelectStock = async (stock) => {
        try {
            const response = await fetch(`${APIServer}/watchlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbol: stock.symbol,
                    userId: userId
                }),
            });

            if (!response.ok) {
                const clone = response.clone();
                const errorText = await clone.text();
                throw new Error(errorText);
            }
            onAddStock(stock);
            setQuery('');
            setShowDropdown(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={styles.container} ref={dropdownRef}>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search stocks to add..."
                style={styles.input}
            />

            {showDropdown && (
                <div style={styles.dropdown}>
                    {isLoading ? (

                        <div>
                            {isAlreadyInWatchlist ? (
                                <div style={styles.loading}>Already in watchlist</div>
                            ) : notFound ? (
                                <div style={styles.loading}>Not found</div>
                            ) : (
                                <div style={styles.loading}>Searching...</div>
                            )}
                        </div>
                    ) : results.length > 0 ? (
                        results.map((stock) => (
                            <div
                                key={stock.symbol}
                                style={styles.searchResult}
                                onClick={() => handleSelectStock(stock)}
                            >
                                <span style={styles.symbol}>{stock.symbol}</span>
                                <span style={styles.name}>{stock.name}</span>
                            </div>
                        ))
                    ) : (
                        <div style={styles.loading}>No results found</div>
                    )}
                </div>
            )}
        </div>
    );
}


export default  StockSearchBar;