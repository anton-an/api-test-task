### Запуск

1. Клонировать репозиторий `git clone https://github.com/anton-an/api-test-task.git`
2. Перейти в папку репозитория `cd api-test-task`
3. Установить зависимости `npm install`
4. Запуск в режиме отладки `npm start` или сборка приложения `npm run build`

### Скрипт для запуска приложения

1. Открыть любой текстовый редактор
2. Написать в нём следущий скрипт:

```
#!/bin/bash
sudo apt update && sudo apt upgrade
sudo apt install git nodejs npm
git clone https://github.com/anton-an/api-test-task.git
cd api-test-task
npm install
npm start
```

3. Сохранить файл с расширением `.sh`
