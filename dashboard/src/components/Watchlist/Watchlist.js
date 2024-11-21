import {useEffect, useState} from "react";
import StockList from "../StockList/StockList";
import StockSearchBar from "../StockSearchBar/StockSearchBar";
import {styles} from "./styles";

function Watchlist({ watchlistData = [] , userId, APIServer}) {

    const [editMode, setEditMode] = useState(false);

    //TODO Review this and delete
    const handleAddWatchlistItem = (stock) => {
        // The WebSocket connection will handle updating the watchlist data
        console.log('Stock added:', stock);
    };

    const handleDeleteWatchlistItem = async (stock, userId, APIServer) => {
        try {
            console.log("deleting for user")
            console.log(userId)
            const response = await fetch(`${APIServer}/watchlist`, {
                method: 'DELETE',
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
            const data = await response.json();
            console.log(data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (watchlistData.length === 0) {
            setEditMode(false);
        }
    }, [watchlistData.length])

    console.log("USING USER ID")
    console.log(userId)
    return (
        <div style={styles.container}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h2>Watchlist</h2>
                {watchlistData.length > 0 && (
                    <button
                        onClick={() => setEditMode(!editMode)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '4px',
                            backgroundColor: editMode ? '#e0e0e0' : '#f0f0f0',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {editMode ? 'Done' : 'Edit'}
                    </button>
                )}
            </div>
            <StockSearchBar watchlistData= {watchlistData} onAddStock={handleAddWatchlistItem} userId={userId} APIServer={APIServer}/>

            {watchlistData.length === 0 ? (
                <div style={styles.emptyState}>
                    <h3>Watchlist is empty</h3>
                    <p>Use the search bar above to add stocks to your watchlist</p>
                </div>
            ) : (

                <StockList
                    stocks={watchlistData.map(watchlistItem => ({
                        ...watchlistItem,
                        name: editMode ? (
                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                    <button
                                        onClick={() => handleDeleteWatchlistItem(watchlistItem, userId, APIServer)}
                                    >
                                        Delete
                                    </button>
                                    {watchlistItem.name}
                                </div>)
                            : watchlistItem.name
                    }))}
                    title=""
                />
            )}
        </div>
    );
}

export default Watchlist;