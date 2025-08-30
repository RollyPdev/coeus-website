// Simple toast utility without external dependencies
export const toast = {
  success: (message: string) => {
    console.log('✅ Success:', message);
    if (typeof window !== 'undefined') {
      alert(`✅ ${message}`);
    }
  },
  error: (message: string) => {
    console.error('❌ Error:', message);
    if (typeof window !== 'undefined') {
      alert(`❌ ${message}`);
    }
  },
  info: (message: string) => {
    console.log('ℹ️ Info:', message);
    if (typeof window !== 'undefined') {
      alert(`ℹ️ ${message}`);
    }
  }
};