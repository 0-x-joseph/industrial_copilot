import { createOpencodeClient } from "@opencode-ai/sdk/client";

// OpenCode client configuration with fallback options
export const createOCPClient = () => {
  // Try local server first, then remote
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? "http://localhost:33721" 
    : "https://analyst-skirts-resolved-moved.trycloudflare.com";
    
  return createOpencodeClient({
    baseUrl,
    throwOnError: false,
  });
};

// Global client instance
export const opcClient = createOCPClient();