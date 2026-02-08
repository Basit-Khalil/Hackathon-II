/**
 * Unit test for widget open/close functionality
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

describe('Chat Widget Open/Close Functionality', () => {
  let chatWidget;
  let mockUserId = 1;

  beforeEach(() => {
    // Create a new instance of ChatWidget
    chatWidget = new ChatWidget(mockUserId);
  });

  test('should initialize with widget closed', () => {
    expect(chatWidget.isOpen).toBe(false);
  });

  test('should open widget when openWidget is called', () => {
    chatWidget.openWidget();
    expect(chatWidget.isOpen).toBe(true);
    expect(chatWidget.widgetContainer.classList.contains('active')).toBe(true);
  });

  test('should close widget when closeWidget is called', () => {
    chatWidget.openWidget(); // First open it
    chatWidget.closeWidget();
    expect(chatWidget.isOpen).toBe(false);
    expect(chatWidget.widgetContainer.classList.contains('active')).toBe(false);
  });

  test('should toggle widget state when toggleWidget is called', () => {
    const initialOpenState = chatWidget.isOpen;
    chatWidget.toggleWidget();
    expect(chatWidget.isOpen).toBe(!initialOpenState);
  });

  test('should hide button when widget is open', () => {
    chatWidget.openWidget();
    expect(chatWidget.buttonElement.style.display).toBe('none');
  });

  test('should show button when widget is closed', () => {
    chatWidget.openWidget(); // Open first
    chatWidget.closeWidget(); // Then close
    expect(chatWidget.buttonElement.style.display).toBe('flex');
  });
});