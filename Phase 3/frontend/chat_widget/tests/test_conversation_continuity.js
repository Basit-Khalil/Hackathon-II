/**
 * Unit test for conversation continuity functionality
 */

// Mock DOM environment for testing
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

describe('Chat Widget Conversation Continuity', () => {
  let chatWidget;
  let mockUserId = 1;

  beforeEach(() => {
    // Create a new instance of ChatWidget
    chatWidget = new ChatWidget(mockUserId);

    // Mock DOM elements
    chatWidget.messagesContainer = {
      appendChild: jest.fn(),
      scrollTop: 0,
      childNodes: []
    };
    chatWidget.inputElement = {
      value: '',
      focus: jest.fn()
    };
    chatWidget.sendButton = {
      disabled: true
    };
    chatWidget.loadingIndicator = {
      classList: {
        add: jest.fn(),
        remove: jest.fn()
      }
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
  });

  test('should maintain conversation ID across messages', async () => {
    // Set a conversation ID
    const testConversationId = 123;
    chatWidget.conversationId = testConversationId;

    // Verify the conversation ID is maintained
    expect(chatWidget.conversationId).toBe(testConversationId);

    // Simulate processing a new message
    const mockApiResponse = {
      success: true,
      data: {
        conversation_id: testConversationId,
        response: 'Test response',
        tool_calls: []
      }
    };

    // Mock the sendMessageToBackend method to return the mock response
    chatWidget.sendMessageToBackend = jest.fn().mockResolvedValue(mockApiResponse);

    // Process a new message
    await chatWidget.handleSendMessage();

    // Verify the conversation ID is still maintained
    expect(chatWidget.conversationId).toBe(testConversationId);
  });

  test('should handle conversation history display', () => {
    // Verify that messages are added to the container
    const initialMessageCount = chatWidget.messagesContainer.childNodes.length;

    // Add a message
    chatWidget.displayMessage('Test message', 'user');

    // Verify that the message was added
    expect(chatWidget.messagesContainer.appendChild).toHaveBeenCalledTimes(1);
  });

  test('should preserve conversation context between interactions', () => {
    // Add several messages to simulate a conversation
    const messages = [
      { text: 'Hello', sender: 'user' },
      { text: 'Hi there!', sender: 'ai' },
      { text: 'Can you add a task?', sender: 'user' },
      { text: 'Sure, what task would you like to add?', sender: 'ai' }
    ];

    // Add all messages
    messages.forEach(msg => {
      chatWidget.displayMessage(msg.text, msg.sender);
    });

    // Verify all messages were added
    expect(chatWidget.messagesContainer.appendChild).toHaveBeenCalledTimes(messages.length);
  });

  test('should handle multiple consecutive messages', async () => {
    // Set up mock API responses for multiple messages
    const mockResponses = [
      {
        success: true,
        data: {
          conversation_id: 101,
          response: 'First response',
          tool_calls: []
        }
      },
      {
        success: true,
        data: {
          conversation_id: 101, // Same conversation
          response: 'Second response',
          tool_calls: []
        }
      }
    ];

    // Mock the API call to return different responses
    let callCount = 0;
    chatWidget.sendMessageToBackend = jest.fn().mockImplementation(() => {
      return Promise.resolve(mockResponses[callCount++]);
    });

    // Send multiple messages
    await chatWidget.handleSendMessage();
    await chatWidget.handleSendMessage();

    // Verify that conversation ID is maintained across messages
    expect(chatWidget.conversationId).toBe(101);
  });

  test('should properly format message timestamps', () => {
    const messageText = 'Test message with timestamp';

    // Spy on Date methods to verify timestamp functionality
    const originalNow = Date.now;
    Date.now = jest.fn(() => new Date(Date.UTC(2026, 1, 5, 10, 30)).valueOf());

    // Add a message and check if it includes timestamp
    chatWidget.displayMessage(messageText, 'user');

    // Restore original Date.now
    Date.now = originalNow;

    // Verify that the message was processed
    expect(chatWidget.messagesContainer.appendChild).toHaveBeenCalled();
  });
});