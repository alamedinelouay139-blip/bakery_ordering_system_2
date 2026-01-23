// Test creating a product
const testProductCreation = async () => {
    const token = 'YOUR_TOKEN_HERE'; // Replace with actual token from localStorage

    try {
        const response = await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: 'Test Croissant',
                description: 'Delicious test croissant',
                price: 3.50,
                stock: 50,
                is_active: 1
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);

        if (!response.ok) {
            console.error('Error:', data);
        } else {
            console.log('Success! Product created with ID:', data.data.id);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
};

// Run the test
testProductCreation();
