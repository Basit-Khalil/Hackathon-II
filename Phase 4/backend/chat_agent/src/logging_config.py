import logging
import sys
from .config.settings import settings


def setup_logging():
    """
    Configure logging for the application.
    """
    # Create logger
    logger = logging.getLogger("chat_agent")
    logger.setLevel(logging.DEBUG if settings.debug else logging.INFO)

    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG if settings.debug else logging.INFO)

    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    console_handler.setFormatter(formatter)

    # Add handlers to logger
    if not logger.handlers:
        logger.addHandler(console_handler)

    return logger


logger = setup_logging()