import {useCallback, useEffect, useRef, useState} from "react";
import {styles} from "./styles";
import MarketUpdates from "../MarketUpdates/MarketUpdates";
import Watchlist from "../Watchlist/Watchlist";

function Dashboard () {
    const [stockData, setStockData] = useState({
        trending: [],
        gainers: [],
        losers: [],
        watchlist: []
    });
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState("");
    const API_SERVER = "http://localhost:3001/api";
    const WEBSOCKET_SERVER = "ws://localhost:3001";

    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

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

                if (data.userId) {
                    console.log("RECEIVED USER ID")
                    setUserId(data.userId);
                    return;
                }

                setStockData(prevData => {
                    if (!prevData.trending.length) {
                        setLoading(false);
                        return data;
                    }
                    return {
                        trending: data.trending || [],
                        gainers: data.gainers || [],
                        losers: data.losers || [],
                        watchlist: data.watchlist || []
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
        connectWebSocket();
        return () => {
            console.log("Dashboard unmounting, cleaning up...");
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
        <div style={styles.container}>
            <div>
                <MarketUpdates losers={stockData.losers} gainers={stockData.gainers} trending={stockData.trending}/>
                <Watchlist watchlistData={stockData.watchlist} userId={userId} APIServer={API_SERVER}/>
            </div>
        </div>
    )
}

export default Dashboard