import axios from 'axios';
import {
  CreateEventLinkPayload,
  AuthkitResponse,
  ConnectorPaginationOptions,
  UserFlags,
} from '../types';

/**
 * Pagination helper function for authkit API that fetches all pages
 * @param url - Base URL for the API
 * @param headers - Request headers
 * @param payload - Request payload
 * @param options - Pagination options
 * @returns Promise with all combined results
 */
async function paginateAuthkitConnections(
  url: string,
  headers: Record<string, string>,
  payload?: CreateEventLinkPayload,
  options: ConnectorPaginationOptions = {},
): Promise<AuthkitResponse> {
  const { limit = 100, maxConcurrentRequests = 3, maxRetries = 3 } = options;

  // Function to fetch a specific page
  const fetchAuthkitPage = async (page: number, pageLimit: number): Promise<AuthkitResponse> => {
    const response = await axios.post<AuthkitResponse>(
      `${url}/v1/authkit?limit=${pageLimit}&page=${page}`,
      payload || {},
      { headers }
    );
    return response.data;
  };

  // First request to get total pages count
  const firstResponse = await fetchAuthkitPage(1, limit);
  const { pages, total } = firstResponse;

  // If we got all data in first request, return it
  if (pages <= 1) {
    return firstResponse;
  }

  // Create array of remaining page numbers to fetch
  const remainingPages = Array.from({ length: pages - 1 }, (_, i) => i + 2);

  // Function to fetch a page with retry logic
  const fetchPageWithRetry = async (page: number): Promise<AuthkitResponse> => {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetchAuthkitPage(page, limit);
        return response;
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          // Exponential backoff: wait 1s, 2s, 4s...
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)),
          );
        }
      }
    }

    throw lastError;
  };

  // Execute requests in batches to avoid overwhelming the API
  const responses: AuthkitResponse[] = [firstResponse];

  for (let i = 0; i < remainingPages.length; i += maxConcurrentRequests) {
    const batch = remainingPages.slice(i, i + maxConcurrentRequests);
    const batchPromises = batch.map((page) => fetchPageWithRetry(page));

    try {
      const batchResults = await Promise.all(batchPromises);
      responses.push(...batchResults);
    } catch (error) {
      console.error(
        `Failed to fetch authkit batch starting at page ${batch[0]}:`,
        error,
      );
      throw error;
    }
  }

  // Combine all results
  const allRows = responses.flatMap((response) => response.rows);
  
  // Get the latest requestId from the most recent response
  const latestResponse = responses[responses.length - 1];

  return {
    rows: allRows,
    page: 1, // Since we're returning all data, we're effectively on "page 1"
    pages: 1,
    total,
    requestId: latestResponse.requestId, // Use the requestId from the latest response
    isWhiteList: false, // Default value, will be updated by createEventLinkTokenApi
  };
}

/**
 * Fetches user whitelist status from /v1/users/flags endpoint
 * @param url - Base URL for the API
 * @param headers - Request headers
 * @returns Promise with boolean indicating whitelist status, defaults to false on error
 */
async function fetchUserWhitelistStatus(
  url: string,
  headers: Record<string, string>,
): Promise<boolean> {
  try {
    const response = await axios.get<UserFlags>(
      `${url}/v1/users/flags`,
      { headers }
    );
    
    // Extract authkitWhitelist directly from response, default to false if not present
    return response.data?.authkitWhitelist ?? false;
  } catch (error) {
    // If the endpoint fails, we don't fail the whole thing, just return false
    console.warn('Failed to fetch user whitelist status, defaulting to false:', error);
    return false;
  }
}

export const createEventLinkTokenApi = async (
  headers: Record<string, string>,
  url: string,
  payload?: CreateEventLinkPayload,
) => {
  try {
    // Fetch user whitelist status (doesn't fail if endpoint fails)
    const isWhiteList = await fetchUserWhitelistStatus(url, headers);

    // Fetch all authkit connections with pagination support
    const authkitResponse = await paginateAuthkitConnections(
      url,
      headers,
      payload,
      { limit: 100, maxConcurrentRequests: 3, maxRetries: 3 }
    );

    // Add isWhiteList to the response
    return {
      ...authkitResponse,
      isWhiteList,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    }
  }
};
