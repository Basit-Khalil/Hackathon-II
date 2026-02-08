/**
 * Unit test for API communication functionality
 */

// Mock environment for testing
global.fetch = jest.fn();

// Import the ChatWidget class
const { ChatWidget } = require('../js/chat_widget');

describe('Chat Widget API Communication', () => {
  let chatWidget;
  let mockUserId = 1;

  beforeEach(() => {
    // Create a new instance of ChatWidget
    chatWidget = new ChatWidget(mockUserId);

    // Reset fetch mock
    global.fetch.mockClear();
  });

  test('should construct correct API URL with user ID', async () => {
    const testMessage = 'Test message for API integration';
    const expectedUrl = `/api/${mockUserId}/chat`;

    // Mock successful API response
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        conversation_id: 456,
        response: 'Test API response',
        tool_calls: []
      })
    });

    // Call the sendMessageToBackend method
    await chatWidget.sendMessageToBackend(testMessage);

    // Verify that fetch was called with the correct URL
    expect(global.fetch).toHaveBeenCalledWith(
      expectedUrl,
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: testMessage })
      })
    );
  });

  test('should return success response for valid API call', async () => {
    const testMessage = 'Test message';
    const mockApiResponse = {
      conversation_id: 789,
      response: 'API response',
      tool_calls: []
    };

    // Mock successful API response
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse)
    });

    // Call the sendMessageToBackend method
    const result = await chatWidget.sendMessageToBackend(testMessage);

    // Verify the response structure
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockApiResponse);
  });

  test('should return error response for failed API call', async () => {
    const testMessage = 'Test message';

    // Mock failed API response
    global.fetch.mockRejectedValue(new Error('Network error'));

    // Call the sendMessageToBackend method
    const result = await chatWidget.sendMessageToBackend(testMessage);

    // Verify the error response structure
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('should handle HTTP error responses', async () => {
    const testMessage = 'Test message';

    // Mock HTTP error response
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    // Call the sendMessageToBackend method
    const result = await chatWidget.sendMessageToBackend(testMessage);

    // Verify the error response structure
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('should include proper headers in API request', async () => {
    const testMessage = 'Test message';

    // Mock successful API response
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        conversation_id: 101,
        response: 'Success',
        tool_calls: []
      })
    });

    // Call the sendMessageToBackend method
    await chatWidget.sendMessageToBackend(testMessage);

    // Verify that the request includes proper headers
    const callArgs = global.fetch.mock.calls[0][1];
    expect(callArgs.headers['Content-Type']).toBe('application/json');
  });
});