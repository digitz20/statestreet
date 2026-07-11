import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary, type FallbackProps } from "react-error-boundary"; // Use type-only import for FallbackProps

// Corrected ErrorFallback component with type guard for 'error'
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  console.error("Error caught by ErrorBoundary:", error);

  let errorMessage = "An unknown error occurred.";
  let errorStack = "";

  if (error instanceof Error) {
    errorMessage = error.message;
    errorStack = error.stack || "";
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    errorMessage = error.message;
  }

  return (
    <div role="alert" style={{ color: "red", padding: 20, border: "1px solid red", margin: 20 }}>
      <p>Something went wrong:</p>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {errorMessage}
        {"\n\n"}
        {errorStack}
      </pre>
      <button onClick={resetErrorBoundary} style={{ marginTop: 10, padding: '8px 16px', cursor: 'pointer' }}>
        Try again
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
  </ErrorBoundary>
);