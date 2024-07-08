import os
import sys
import ssl

from datetime import datetime
from pytz import timezone

from base64 import b64decode

import smtplib
import imaplib

from email.mime.multipart import MIMEMultipart 
from email.mime.text import MIMEText 
from email.mime.base import MIMEBase 
import email.utils
from email import encoders 

from .models import MailSetting

# Generate PDF from data
# with open('login-form.svg', 'r') as file:
#   svg = file.read()

# for key, value in details.items():
#     svg = svg.replace('{'+ key.lower() + '}', value)

# with open('Login-Form-'+details_id+'.svg', 'w') as file:
#   file.write(svg)


# print(os.system('inkscape -A Login-Form-'+details_id+'.pdf Login-Form-'+details_id+'.svg'))

# Send with attachment
# https://www.geeksforgeeks.org/send-mail-attachment-gmail-account-using-python/
# Python code to illustrate Sending mail with attachments 
# from your Gmail account  


def Send_mail(mail, details):
    
    settings = mail.setting
    mail = mail.To_json()
      
    # instance of MIMEMultipart 
    msg = MIMEMultipart() 
  
    # Message ID
    msg['Message-ID'] = email.utils.make_msgid('hars', 'hpc.iitk.ac.in')

    # Message Date
    t = datetime.now(timezone('Asia/Kolkata'))
    msg['Date'] = t.strftime("%a, %d %b %Y %H:%M:%S +0530")
    
    # storing the senders email address   
    msg['From'] = settings.from_header 

    # replace parts of To
    for key, value in details.items():
        mail['To'] = mail['To'].replace('{'+ key.lower() + '}', str(value)) 

    # replace parts of To
    for key, value in details.items():
        mail['CC'] = mail['CC'].replace('{'+ key.lower() + '}', str(value)) 

    # storing the receivers email address  
    msg['To'] = mail['To']
    msg['CC'] = mail['CC'] 
      
    # replace parts of the subject 
    for key, value in details.items():
        mail['Subject'] = mail['Subject'].replace('{'+ key.lower() + '}', str(value)) 
        
    msg['Subject'] = mail['Subject']
      
    # replace parts of the body 
    for key, value in details.items():
        mail['Body'] = mail['Body'].replace('{'+ key.lower() + '}', str(value))
     
    # attach the body with the msg instance 
    msg.attach(MIMEText(mail['Body'], 'plain')) 
      

    s = smtplib.SMTP(settings.smtp_server, settings.smtp_port) 
      
    # start TLS for security 
    s.starttls() 
      
    # Authentication 
    s.login(settings.username, b64decode(settings.password.encode()).decode())
      
    # Converts the Multipart msg into a string 
    text = msg.as_string() 
      
    # sending the mail 
    s.sendmail(settings.from_header, mail['To'] + "," + mail['CC'], text) 
      
    # terminating the session 
    s.quit()

    # Save in Send folder

    # Load system's trusted SSL certificates
    tls_context = ssl.create_default_context()

    # Connect (unencrypted at first)
    imap = imaplib.IMAP4(settings.imap_server, settings.imap_port)

    # Start TLS encryption. Will fail if TLS session can't be established
    imap.starttls(ssl_context=tls_context)

    print("Email time = ", t.strftime("%a, %d %b %Y %H:%M:%S +0530"))

    # Login. ONLY DO THIS AFTER server.starttls() !!
    imap.login(settings.username, b64decode(settings.password.encode()).decode())
    imap.append('INBOX.Sent', '\\Seen', imaplib.Time2Internaldate(t), text.encode('utf-8'))
    imap.logout()
