// Simple test script to verify export functionality
const testExport = async () => {
  try {
    console.log('Testing CSV export...');
    const response = await fetch('http://localhost:3000/api/admin/students/export?format=csv');
    
    if (response.ok) {
      const text = await response.text();
      console.log('CSV Export successful!');
      console.log('First 200 characters:', text.substring(0, 200));
      console.log('Content-Type:', response.headers.get('Content-Type'));
      console.log('Content-Disposition:', response.headers.get('Content-Disposition'));
    } else {
      console.error('CSV Export failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test if this file is executed directly
if (require.main === module) {
  testExport();
}

module.exports = { testExport };