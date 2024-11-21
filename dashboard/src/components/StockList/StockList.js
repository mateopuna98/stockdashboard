import {styles} from "./styles";
function StockList ({stocks, title}) {
    const isPositive = (change) => change > 0;
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
                            <div style={styles.price}> {stock.dummy_price.toFixed(2)}</div>
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

export default StockList