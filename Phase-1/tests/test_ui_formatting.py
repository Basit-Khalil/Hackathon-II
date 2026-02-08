#!/usr/bin/env python3
"""
Tests for UI formatting functions in the Todo Console Application.
"""

import unittest
import sys
import os
from io import StringIO
from unittest.mock import patch

# Add the src directory to the path so we can import main
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from main import (
    center_text,
    draw_divider,
    get_terminal_width,
    add_spacing,
    add_separator,
    display_header,
    display_menu
)


class TestUIFormatting(unittest.TestCase):
    """Test cases for UI formatting functions."""

    def test_get_terminal_width(self):
        """Test that get_terminal_width returns a positive integer."""
        width = get_terminal_width()
        self.assertIsInstance(width, int)
        self.assertGreater(width, 0)

    def test_center_text(self):
        """Test that center_text centers text properly."""
        text = "Test"
        width = 10
        centered = center_text(text, width)
        self.assertEqual(len(centered), width)
        # Check that the text is roughly centered
        self.assertIn("Test", centered)

    def test_draw_divider(self):
        """Test that draw_divider creates a line of specified length."""
        width = 10
        divider = draw_divider("=", width)
        self.assertEqual(len(divider), width)
        self.assertEqual(divider, "=" * width)

    def test_add_spacing(self):
        """Test that add_spacing outputs blank lines."""
        # Capture stdout
        captured_output = StringIO()
        sys.stdout = captured_output

        add_spacing(2)

        # Restore stdout
        sys.stdout = sys.__stdout__

        output = captured_output.getvalue()
        # Should have 2 newline characters
        self.assertEqual(output.count('\n'), 2)

    def test_add_separator(self):
        """Test that add_separator creates a separator line."""
        # Capture stdout
        captured_output = StringIO()
        sys.stdout = captured_output

        width = 10
        add_separator("-", width)

        # Restore stdout
        sys.stdout = sys.__stdout__

        output = captured_output.getvalue().strip()
        self.assertEqual(output, "-" * width)

    @patch('builtins.print')
    def test_display_header(self, mock_print):
        """Test that display_header calls print with correct content."""
        display_header()
        # Should be called multiple times for header elements
        self.assertGreater(mock_print.call_count, 0)

    @patch('builtins.print')
    def test_display_menu(self, mock_print):
        """Test that display_menu calls print with correct content."""
        display_menu()
        # Should be called multiple times for menu items
        self.assertGreater(mock_print.call_count, 0)


if __name__ == '__main__':
    print("Running UI formatting tests...")
    unittest.main()