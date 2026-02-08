/**
 * Unit test for floating button functionality
 */

// Mock DOM environment for testing
global.document = {
  createElement: jest.fn(),
  getElementById: jest.fn(),
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

describe('Chat Widget Button Functionality', () => {
  let chatWidget;
  let mockUserId = 1;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create a new instance of ChatWidget
    chatWidget = new ChatWidget(mockUserId);
  });

  test('should create a floating button element', () => {
    expect(chatWidget.buttonElement).toBeDefined();
    expect(chatWidget.buttonElement.id).toBe('chat-widget-button');
    expect(chatWidget.buttonElement.innerHTML).toBe('💬');
  });

  test('should have proper attributes on the button', () => {
    expect(chatWidget.buttonElement.getAttribute('aria-label')).toBe('Open chat widget');
    expect(chatWidget.buttonElement.getAttribute('title')).toBe('Chat with AI Assistant');
    expect(chatWidget.buttonElement.className).toBe('chat-widget-button');
  });

  test('should attach button to document body', () => {
    expect(global.document.body.appendChild).toHaveBeenCalledWith(chatWidget.buttonElement);
  });
});