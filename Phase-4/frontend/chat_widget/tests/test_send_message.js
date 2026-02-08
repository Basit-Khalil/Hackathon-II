/**
 * Unit test for message sending functionality
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

describe('Chat Widget Message Sending Functionality', () => {
  let chatWidget;
  let mockUserId = 1;

  beforeEach(() => {
    // Create a new instance of ChatWidget
    chatWidget = new ChatWidget(mockUserId);

    // Mock fetch to simulate API calls
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        conversation_id: 123,
        response: 'Test response from AI',
        tool_calls: []
      })
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should send message to backend API', async () => {
    // Set up a message to send
    chatWidget.inputElement = {
      value: 'Test message',
      focus: jest.fn()
    };
    chatWidget.sendButton = {
      disabled: false
    };
    chatWidget.messagesContainer = {
      appendChild: jest.fn(),
      scrollTop: 0
    };
    chatWidget.widgetContainer = {
      classList: {
        add: jest.fn(),
        remove: jest.fn()
      }
    };
    chatWidget.buttonElement = {
      style: {
        display: 'flex'
      }
    };

    // Call handleSendMessage with a test message
    chatWidget.inputElement.value = 'Test message for sending';
    await chatWidget.handleSendMessage();

    // Verify fetch was called with the correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      `/api/${mockUserId}/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Test message for sending' })
      }
    );
  });

  test('should display user message in the chat', () => {
    const messageContainer = {
      appendChild: jest.fn(),
      scrollTop: 0
    };
    chatWidget.messagesContainer = messageContainer;

    // Call displayMessage for a user message
    chatWidget.displayMessage('Test user message', 'user');

    // Verify the message was added to the container
    expect(messageContainer.appendChild).toHaveBeenCalledTimes(1);
  });

  test('should display AI response in the chat', () => {
    const messageContainer = {
      appendChild: jest.fn(),
      scrollTop: 0
    };
    chatWidget.messagesContainer = messageContainer;

    // Call displayMessage for an AI message
    chatWidget.displayMessage('Test AI response', 'ai');

    // Verify the response was added to the container
    expect(messageContainer.appendChild).toHaveBeenCalledTimes(1);
  });

  test('should handle empty message input gracefully', async () => {
    const originalValue = chatWidget.inputElement?.value || '';
    chatWidget.inputElement = {
      value: '',
      focus: jest.fn()
    };

    // Call handleSendMessage with an empty message
    await chatWidget.handleSendMessage();

    // Verify fetch was not called for empty message
    expect(global.fetch).not.toHaveBeenCalled();
  });
});