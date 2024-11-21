export const styles = {
    container: {
        width: '100%',
        backgroundColor: 'white',
        padding: '12px',
        fontFamily: 'Arial, sans-serif',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    header: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '12px',
        borderBottom: '1px solid #eee',
        paddingBottom: '6px',
        color: '#333',
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #eee',
    },
    stockInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    symbol: {
        color: '#0066cc',
        fontWeight: 'bold',
        fontSize: '14px',
    },
    name: {
        color: '#666',
        fontSize: '12px',
        maxWidth: '160px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    price: {
        fontSize: '13px',
        fontWeight: '500',
        textAlign: 'right',
    }
};