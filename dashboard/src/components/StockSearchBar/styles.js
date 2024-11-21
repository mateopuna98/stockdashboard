export const styles = {
    container: {
        position: 'relative',
        width: '300px',
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '8px 12px',
        fontSize: '14px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        outline: 'none',
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginTop: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000,
    },
    searchResult: {
        padding: '8px 12px',
        cursor: 'pointer',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    loading: {
        textAlign: 'center',
        padding: '8px',
        color: '#666',
    }
};
