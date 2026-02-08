/**
 * Unit test for error handling functionality
 */

// Mock DOM environment for testing
global.fetch = jest.fn();
global.document = {
  createElement: jest.fn(),
  getElementById: jest.fn(),
  querySelector: jest.fn(),
  addEventListener: jest.fn(),
  body: {
    appendChild: jest.fn()
  }
};

global.window = {
  ChatWidget: {}
};

// Import the ChatWidget class
const { ChatWidget } = require('../js/chat_widget');

describe('Chat Widget Error Handling', () => {
  let chatWidget;
  let mockUserId = 1;

  beforeEach(() => {
    // Create a new instance of ChatWidget
    chatWidget = new ChatWidget(mockUserId);

    // Mock DOM elements
    chatWidget.messagesContainer = {
      appendChild: jest.fn(),
      scrollTop: 0
    };
    chatWidget.inputElement = {
      value: '',
      focus: jest.fn(),
      disabled: false
    };
    chatWidget.sendButton = {
      disabled: false
    };
    chatWidget.loadingIndicator = {
      classList: {
        add: jest.fn(),
        remove: jest.fn()
      }
    };
  });

  test('should display error message when API call fails', async () => {
    // Mock API failure
    global.fetch.mockRejectedValue(new Error('API request failed'));

    // Mock input element
    chatWidget.inputElement.value = 'Test message that will fail';

    // Call handleSendMessage which should trigger error handling
    await chatWidget.handleSendMessage();

    // Verify that an error message was displayed
    expect(chatWidget.messagesContainer.appendChild).toHaveBeenCalled();
  });

  test('should handle HTTP error responses gracefully', async () => {
    // Mock HTTP error response
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    // Call sendMessageToBackend which should handle the error
    const result = await chatWidget.sendMessageToBackend('Test message');

    // Verify that the result indicates failure
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('should show loading indicator during processing and hide on error', async () => {
    // Mock API failure during processing
    global.fetch.mockRejectedValue(new Error('Network error'));

    // Mock input element
    chatWidget.inputElement.value = 'Test message';

    // Call handleSendMessage which should trigger loading and error handling
    await chatWidget.handleSendMessage();

    // Verify that loading indicator was shown and then hidden
    expect(chatWidget.loadingIndicator.classList.add).toHaveBeenCalledWith('active');
    expect(chatWidget.loadingIndicator.classList.remove).toHaveBeenCalledWith('active');
  });

  test('should re-enable input fields after error occurs', async () => {
    // Mock API failure
    global.fetch.mockRejectedValue(new Error('API request failed'));

    // Mock input element
    chatWidget.inputElement.value = 'Test message';

    // Call handleSendMessage which should handle error and re-enable input
    await chatWidget.handleSendMessage();

    // Verify that input fields are re-enabled after error handling
    expect(chatWidget.inputElement.disabled).toBe(false);
  });

  test('should handle invalid API response gracefully', async () => {
    // Mock invalid API response
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON response'))
    });

    // Call sendMessageToBackend which should handle the parsing error
    const result = await chatWidget.sendMessageToBackend('Test message');

    // Verify that the result indicates failure
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('should display error message in the chat interface', () => {
    const errorMessage = 'Test error message';

    // Call displayErrorMessage
    chatWidget.displayErrorMessage(errorMessage);

    // Verify that an error message element was added to the container
    expect(chatWidget.messagesContainer.appendChild).toHaveBeenCalled();
  });

  test('should handle network timeout errors', async () => {
    // Mock timeout error
    global.fetch.mockImplementation(() => {
      return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Network timeout')), 10);
      });
    });

    // Call sendMessageToBackend which should handle the timeout
    const result = await chatWidget.sendMessageToBackend('Test message');

    // Verify that the result indicates failure
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});