# Методы работы с базой данных
import mysql.connector as mysql
import json
import config

# Поиск компонента по имени
def findComponent(component_name, isStrict=False):   
    createScheme() 
    query = f"SELECT id, name, params, result FROM components WHERE name LIKE '{component_name}%'" if not isStrict else f"SELECT id, name, params, result FROM components WHERE name LIKE '{component_name}'"
    print(query)
    return exec(query)

# Удаление компонента по идентификатору
def removeComponent(id):
    createScheme()
    query = f"DELETE FROM components WHERE id = {id}"
    return execNonQuery(query)

# Сохранение компонента с изменением
def saveComponent(name, params, result):
    createScheme()
    query = f"""
    REPLACE INTO components(name, params, `result`)
    VALUES('{name}', '{params}', '{result}')
    """
    execNonQuery(query)

def saveWithEditComponent(name, params, result):
    createScheme()
    query = f"""
    UPDATE components set params='{params}', result='{result}' 
    WHERE name='{name}'
    """
    execNonQuery(query)

# Форматирование компонента из row в json 
def formatComponent(component):
    return {
        "id": component[0],
        "name": component[1],
        "params": json.loads(component[2]),
        "result": json.loads(component[3])
    }

# Создание схемы СУБД
def createScheme():
    query = f"""
           CREATE TABLE IF NOT EXISTS components ( 
               id INT AUTO_INCREMENT PRIMARY KEY,
               name VARCHAR(32),
               params JSON,
               result JSON
           )
    """
    exec(query)

# Выполнить запрос без результата
def execNonQuery(query):
    try:
        with mysql.connect(**config.getDbConfig(), auth_plugin='mysql_native_password') as connection:
            cursor = connection.cursor()
            cursor.execute(query)
            connection.commit()
    except mysql.Error as e:
        print(f"Ошибка подключения к СУБД: {e}")

# Выполнить запрос с результатом
def exec(query):
    retVal = list()
    try:
        with mysql.connect(**config.getDbConfig(),  auth_plugin='mysql_native_password') as connection:
            print(connection)
            cursor = connection.cursor()
            cursor.execute(query)
            result = cursor.fetchall()

            for row in result:
                retVal.append(formatComponent(row))

    except mysql.Error as e:
        print(f"Ошибка подключения к СУБД: {e}")
    return retVal

# unit test

def updateTable():
    query = f"""
           ALTER TABLE components ( 
               ADD CONSTRAINT unique(name)
           )
    """
    exec(query)
# if __name__ == "__main__":
    # test add component
    # saveComponent('test', '{}', '{}')
    # test find
    # comp = findComponent('test', True)
    # saveWithEditComponent('diode2', '{"If":[1,2,3]}', '{}')
    # updateTable()
    #test delete
    # removeComponent(comp[0]['id'])