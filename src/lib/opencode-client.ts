import { createOpencodeClient } from "@opencode-ai/sdk/client";

// OpenCode client configuration with fallback options
export const createOCPClient = () => {
  // Determine the base URL based on environment
  let baseUrl: string;
  
  // In browser, use relative URL to hit Next.js API routes (mock)
  if (typeof window !== 'undefined') {
    baseUrl = window.location.origin;
  } 
  // In server-side rendering, try OpenCode server
  else {
    baseUrl = process.env.OPENCODE_API_URL || "http://localhost:4096";
  }
    
  return createOpencodeClient({
    baseUrl,
    throwOnError: false,
  });
};

// Global client instance
export const opcClient = createOCPClient();