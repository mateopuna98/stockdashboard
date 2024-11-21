export const styles = {
    container: {
        width: '100%',
        backgroundColor: 'white',
        padding: '16px',
        fontFamily: 'Arial, sans-serif',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    header: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '16px',
        borderBottom: '1px solid #eee',
        paddingBottom: '8px',
        color: '#333',
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 0',
        borderBottom: '1px solid #eee',
    },
    stockInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    symbol: {
        color: '#0066cc',
        fontWeight: 'bold',
        fontSize: '18px',
    },
    name: {
        color: '#666',
        fontSize: '14px',
        maxWidth: '180px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    price: {
        fontSize: '16px',
        fontWeight: '500',
        textAlign: 'right',
    }
};