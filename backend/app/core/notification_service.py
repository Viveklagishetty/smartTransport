import logging

# Configure basic logging to console to simulate "Real-time" notification service
logger = logging.getLogger("notification_service")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter('%(asctime)s - [NOTIFICATION] - %(message)s'))
logger.addHandler(handler)

from sqlmodel import Session
from ..models.notification import Notification

def send_notification(phone: str, email: str, message: str, user_id: int, session: Session):
    """
    Simulates sending a real-time notification to SMS and Email.
    Saves to DB for In-App Notification.
    """
    # Log to console (simulating external API call)
    logger.info(f"SENDING SMS to {phone}: {message}")
    logger.info(f"SENDING EMAIL to {email}: {message}")

    # Save to Database for In-App display
    try:
        notification = Notification(user_id=user_id, message=message, type="in-app")
        session.add(notification)
        session.commit()
    except Exception as e:
        logger.error(f"Failed to save notification: {e}")

    # Attempt Real Email if Enabled
    from ..core.config import settings
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    if settings.EMAILS_ENABLED and settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
        try:
            msg = MIMEMultipart()
            msg['From'] = settings.SMTP_USERNAME
            msg['To'] = email
            msg['Subject'] = "SmartTrans Notification"
            msg.attach(MIMEText(message, 'plain'))

            server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            text = msg.as_string()
            server.sendmail(settings.SMTP_USERNAME, email, text)
            server.quit()
            logger.info(f"REAL EMAIL SENT to {email}")
        except Exception as e:
            logger.error(f"Failed to send real email: {e}")
