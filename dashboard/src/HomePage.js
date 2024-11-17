import {useEffect, useState, useRef, useCallback} from "react";

function Header () {
        return (
            <div className="header">
                <h1>Simple Stock Observatory</h1>
            </div>
        )
    }

function StockList ({stocks, title}) {
    const isPositive = (change) => change > 0;
    const styles = {
        container: {
            width: '300px',
            backgroundColor: 'white',
            padding: '10px',
            fontFamily: 'Arial, sans-serif',
        },
        header: {
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '15px',
            borderBottom: '1px solid #eee',
            paddingBottom: '8px',
        },
        item: {
            display: 'grid',
            gridTemplateColumns: '1fr 80px 80px',
            gap: '10px',
            padding: '12px 0',
            borderBottom: '1px solid #eee',
        },
        stockInfo: {
            display: 'flex',
            flexDirection: 'column',
        },
        symbol: {
            color: '#0066cc',
            fontWeight: 'bold',
            fontSize: '14px',
        },
        name: {
            color: '#666',
            fontSize: '12px',
        },
        price: {
            fontSize: '14px',
            textAlign: 'right',
        },
        change: {
            color: 'red',
            fontSize: '14px',
            textAlign: 'right',
        }
    };

    return (
        <div className="stock-list" style={styles.container}>
            <div style={styles.header}>{title}</div>
            {stocks.map((stock, index) => {
                const positive = isPositive(stock.change);
                return (
                <div
                    key={stock.symbol}
                    style={{
                        ...styles.item,
                        borderBottom: index === stocks.length -1 ? 'none': '1px soled #eee'
                    }}
                >
                    <div style={styles.stockInfo}>
                        <span style={styles.symbol}>{stock.symbol}</span>
                        <span style={styles.name}>{stock.name}</span>
                    </div>
                    <div>
                        <div style={styles.price}> {stock.price.toFixed(2)}</div>
                        <div style={{
                            ...styles.price,
                            color: positive ? '#2e7d32' : '#d32f2f'}}>
                            {positive ? "+" : '' }{stock.change.toFixed(2)} ({stock.percentChange.toFixed(2)}%)
                        </div>
                    </div>
                </div>
                );
            })}
        </div>
    )
}


function MarketUpdates({losers, gainers, trending}) {
    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '8px',
            padding: '20px',
            maxWidth: '1200px',
            margin: '0 auto',
        }
    }
    return (
        <div>
            <h2>Market updates</h2>
            <div style={styles.container} className="market-updates">
                <StockList stocks={losers} title="LOSERS"/>
                <StockList stocks={gainers} title="GAINERS"/>
                <StockList stocks={trending} title="TRENDING"/>

            </div>
        </div>

    )
}

function Watchlist () {
    return (
        <div>
            <h2>Watchlist</h2>
            <div>
                    <h3>Watchlist is empty</h3>
            </div>
        </div>

    )
}

function Dashboard () {
    const [stockData, setStockData] = useState({
        trending: [],
        gainers: [],
        losers: []
    });
    const [loading, setLoading] = useState(true);

    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const WEBSOCKET_SERVER = "ws://localhost:3001";


    const connectWebSocket = useCallback(() => {

        if (wsRef.current) {
            return;
        }


        console.log("Running connectWebSocket");
        const ws = new WebSocket(WEBSOCKET_SERVER);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('Connected to WebSocket');
        };

        ws.onerror = (error) => {
            console.error("WebSocket error", error);
        }

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setStockData(prevData => {
                    if (!prevData.trending.length) {
                        setLoading(false);
                        return data;
                    }
                    return {
                        trending: data.trending || [],
                        gainers: data.gainers || [],
                        losers: data.losers || []
                    };
                });
            } catch (err) {
                console.error("Error parsing WebSocket data:", err);
            }

        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            wsRef.current = null;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null
            }
        };

        return () => {

        };
    }, []);

    useEffect(() => {
        console.log("Dashboard mounted, connecting WebSocket...");
        const cleanup = connectWebSocket();
        return () => {
            console.log("Dashboard unmounting, cleaning up...");
            cleanup();
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null
            }
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                console.log('Closing WebSocket connection due to app teardown...');
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    },[connectWebSocket]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }
    return (
        <div className="dashboard" >
            <MarketUpdates losers={stockData.losers}  gainers={stockData.gainers} trending={stockData.trending}/>
            <Watchlist />
        </div>
    )
}
function HomePage () {
    return (
        <div>
            <Header />
            <Dashboard />
        </div>
    )
}
export default HomePage;
