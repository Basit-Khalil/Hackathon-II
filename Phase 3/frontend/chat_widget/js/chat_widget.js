/**
 * Chat Widget Implementation
 * A floating chat widget that integrates with the AI backend
 */

class ChatWidget {
  constructor(userId) {
    this.userId = userId;
    this.isOpen = false;
    this.isLoading = false;
    this.conversationId = null;
    this.widgetContainer = null;
    this.buttonElement = null;
    this.messagesContainer = null;
    this.inputElement = null;
    this.sendButton = null;
    this.closeButton = null;
    this.loadingIndicator = null;

    this.init();
  }

  /**
   * Initialize the chat widget
   */
  static init(userId) {
    if (!window.ChatWidgetInstance) {
      window.ChatWidgetInstance = new ChatWidget(userId);
    }
    return window.ChatWidgetInstance;
  }

  /**
   * Initialize the widget elements and event listeners
   */
  init() {
    this.createElements();
    this.setupEventListeners();
  }

  /**
   * Create all DOM elements for the chat widget
   */
  createElements() {
    // Create the floating chat button
    this.buttonElement = document.createElement('button');
    this.buttonElement.id = 'chat-widget-button';
    this.buttonElement.innerHTML = '💬';
    this.buttonElement.setAttribute('aria-label', 'Open chat widget');
    this.buttonElement.setAttribute('title', 'Chat with AI Assistant');
    this.buttonElement.className = 'chat-widget-button';
    document.body.appendChild(this.buttonElement);

    // Create the chat widget container
    this.widgetContainer = document.createElement('div');
    this.widgetContainer.id = 'chat-widget-container';
    this.widgetContainer.className = 'chat-widget-container';
    this.widgetContainer.innerHTML = `
      <div class="chat-header">
        <h3>AI Task Assistant</h3>
        <button class="close-button" aria-label="Close chat">✕</button>
      </div>
      <div class="chat-messages" id="chat-messages-container">
        <div class="welcome-message">
          <div class="message ai-message">
            Hello! I'm your AI assistant. How can I help you with your tasks today?
          </div>
        </div>
      </div>
      <div class="loading-indicator" id="loading-indicator">
        <div class="spinner"></div>
        <span>Thinking...</span>
      </div>
      <div class="chat-input-area">
        <textarea
          class="chat-input"
          id="chat-input"
          placeholder="Type your message here..."
          rows="1"
        ></textarea>
        <button class="send-button" id="send-button" disabled>Send</button>
      </div>
    `;
    document.body.appendChild(this.widgetContainer);

    // Get references to important elements
    this.messagesContainer = document.getElementById('chat-messages-container');
    this.inputElement = document.getElementById('chat-input');
    this.sendButton = document.getElementById('send-button');
    this.closeButton = this.widgetContainer.querySelector('.close-button');
    this.loadingIndicator = document.getElementById('loading-indicator');

    // Set up auto-resizing for textarea
    this.setupTextareaAutoResize();
  }

  /**
   * Set up event listeners for the widget
   */
  setupEventListeners() {
    // Toggle chat widget when button is clicked
    this.buttonElement.addEventListener('click', () => {
      this.toggleWidget();
    });

    // Close chat widget when close button is clicked
    this.closeButton.addEventListener('click', () => {
      this.closeWidget();
    });

    // Send message when send button is clicked
    this.sendButton.addEventListener('click', () => {
      this.handleSendMessage();
    });

    // Send message when Enter is pressed (without Shift)
    this.inputElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSendMessage();
      }
    });

    // Enable send button when input has text
    this.inputElement.addEventListener('input', () => {
      this.sendButton.disabled = !this.inputElement.value.trim();
      this.adjustTextareaHeight();
    });
  }

  /**
   * Set up auto-resizing for the textarea
   */
  setupTextareaAutoResize() {
    this.inputElement.addEventListener('input', () => {
      this.adjustTextareaHeight();
    });
  }

  /**
   * Adjust the height of the textarea based on content
   */
  adjustTextareaHeight() {
    this.inputElement.style.height = 'auto';
    this.inputElement.style.height = Math.min(this.inputElement.scrollHeight, 100) + 'px';
  }

  /**
   * Toggle the visibility of the chat widget
   */
  toggleWidget() {
    if (this.isOpen) {
      this.closeWidget();
    } else {
      this.openWidget();
    }
  }

  /**
   * Open the chat widget
   */
  openWidget() {
    this.widgetContainer.classList.add('active');
    this.isOpen = true;
    this.buttonElement.style.display = 'none';
    this.inputElement.focus();
  }

  /**
   * Close the chat widget
   */
  closeWidget() {
    this.widgetContainer.classList.remove('active');
    this.isOpen = false;
    this.buttonElement.style.display = 'flex';
  }

  /**
   * Handle sending a message
   */
  async handleSendMessage() {
    const messageText = this.inputElement.value.trim();
    if (!messageText) return;

    // Disable input while processing
    this.setInputEnabled(false);

    try {
      // Display user message immediately
      this.displayMessage(messageText, 'user');

      // Clear input
      this.inputElement.value = '';
      this.sendButton.disabled = true;

      // Show loading indicator
      this.showLoadingIndicator();

      // Send message to backend
      const response = await this.sendMessageToBackend(messageText);

      // Hide loading indicator
      this.hideLoadingIndicator();

      if (response.success) {
        // Display AI response
        this.displayMessage(response.data.response, 'ai');

        // Store conversation ID if received
        if (response.data.conversation_id) {
          this.conversationId = response.data.conversation_id;
        }
      } else {
        // Display error message
        this.displayErrorMessage(response.error || 'An error occurred while processing your request.');
      }
    } catch (error) {
      // Hide loading indicator
      this.hideLoadingIndicator();

      // Display error message
      this.displayErrorMessage(error.message || 'An error occurred while sending your message.');
    } finally {
      // Re-enable input
      this.setInputEnabled(true);
      this.inputElement.focus();
    }
  }

  /**
   * Send message to the backend API
   */
  async sendMessageToBackend(message) {
    const url = `/api/${this.userId}/chat`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any required authentication headers here
          // 'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error sending message to backend:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Display a message in the chat
   */
  displayMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;

    // Add timestamp
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageElement.innerHTML = `
      <div>${this.escapeHtml(text)}</div>
      <div class="message-timestamp">${timestamp}</div>
    `;

    this.messagesContainer.appendChild(messageElement);

    // Scroll to bottom
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  /**
   * Display an error message
   */
  displayErrorMessage(errorMessage) {
    const errorElement = document.createElement('div');
    errorElement.className = 'message error-message';
    errorElement.textContent = `Error: ${errorMessage}`;

    this.messagesContainer.appendChild(errorElement);

    // Scroll to bottom
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  /**
   * Show the loading indicator
   */
  showLoadingIndicator() {
    this.loadingIndicator.classList.add('active');
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  /**
   * Hide the loading indicator
   */
  hideLoadingIndicator() {
    this.loadingIndicator.classList.remove('active');
  }

  /**
   * Enable or disable input fields
   */
  setInputEnabled(enabled) {
    this.inputElement.disabled = !enabled;
    this.sendButton.disabled = !enabled || !this.inputElement.value.trim();
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Export for use in other modules or direct browser usage
if (typeof window !== 'undefined') {
  window.ChatWidget = ChatWidget;
}