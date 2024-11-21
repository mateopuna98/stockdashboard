import StockList from "../StockList/StockList";
import {styles} from "./styles";
function MarketUpdates({losers, gainers, trending}) {
    return (
        <div style={styles.wrapper}>
            <h2>Market updates</h2>
            <div style={styles.container} className="market-updates">
                <StockList stocks={gainers} title="GAINERS"/>
                <StockList stocks={losers} title="LOSERS"/>
                <StockList stocks={trending} title="TRENDING"/>
            </div>
        </div>

    )
}

export default MarketUpdates