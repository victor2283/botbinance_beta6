import sys
import os
import threading
from PyQt6.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget
from PyQt6.QtWebEngineWidgets import QWebEngineView
from PyQt6.QtCore import QUrl


class Browser(QMainWindow):
    def __init__(self):
        super().__init__()

        self.host = 'localhost'
        self.port = 8000
        self.setWindowTitle('Bot_trading')
        self.setGeometry(300, 300, 1024, 768)
        self.browser = QWebEngineView()
        self.browser.setUrl(QUrl(f'http://{self.host}:{self.port}'))

        self.layout = QVBoxLayout()
    
        self.layout.addWidget(self.browser)

        self.container = QWidget()
        self.container.setLayout(self.layout)
        self.setCentralWidget(self.container)

    

if __name__ == '__main__':
    django_project_path = os.path.join(os.getcwd(), 'backend')
    def run_django_server():
        os.chdir(django_project_path)
        os.system(f'python manage.py runserver 8000')
       
    server_thread = threading.Thread(target=run_django_server)
    server_thread.daemon = True
    server_thread.start()

    # Iniciar la aplicación PyQt
    app = QApplication(sys.argv)
    browser = Browser()
    browser.show()
    sys.exit(app.exec())
