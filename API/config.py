import os

DEBUG=True
HOST = '0.0.0.0'
PORT = int(os.getenv('PORT', '5000'))

# Получение конфигурации из переменных окружения
DB = {
    'user': os.getenv('DB_USER', 'usr'),
    'pw': os.getenv('DB_PASSWORD', '48>oQ73x'),
    'host': os.getenv('DB_HOST', '127.0.0.1'),
    'port': os.getenv('DB_PORT', ''),
    'db': os.getenv('DB_NAME', 'components'),
}

# ToDo: Валидация переменных окружения

# Получение конфигурации СУБД
def getDbConfig ():
    return {
        'user': DB['user'],
        'password': DB['pw'],
        'database': DB['db']    
    }