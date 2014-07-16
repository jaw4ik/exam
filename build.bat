SET BUILD_PATH=..\build\Exam

CALL weyland build

rmdir "%BUILD_PATH%" /s /q
mkdir "%BUILD_PATH%"

mkdir "%BUILD_PATH%\css"
xcopy css\images\*.* "%BUILD_PATH%\css\images\*.*" /s /f /y
xcopy css\fonts\*.* "%BUILD_PATH%\css\fonts\*.*" /s /f /y
copy css\general.min.css "%BUILD_PATH%\css\general.css"

xcopy img\*.* "%BUILD_PATH%\img\*.*" /s /f /y
xcopy content\*.* "%BUILD_PATH%\content\*.*" /s /f /y

mkdir "%BUILD_PATH%\js"
copy js\vendor.min.js "%BUILD_PATH%\js\vendor.min.js"
copy js\require.js "%BUILD_PATH%\js\require.js" 

mkdir "%BUILD_PATH%\app"
copy app\main-built.js "%BUILD_PATH%\app\main.js"

copy settings.js "%BUILD_PATH%\settings.js"
copy publishSettings.js "%BUILD_PATH%\publishSettings.js"
copy index.html "%BUILD_PATH%\index.html"

mkdir "%BUILD_PATH%\settings"
mkdir "%BUILD_PATH%\settings\css"
copy settings\css\settings.min.css "%BUILD_PATH%\settings\css\settings.min.css"
xcopy settings\css\fonts\*.* "%BUILD_PATH%\settings\css\fonts\*.*" /s /f /y
xcopy settings\img\*.* "%BUILD_PATH%\settings\img\*.*" /s /f /y

mkdir "%BUILD_PATH%\settings\js"
copy settings\js\vendor.js "%BUILD_PATH%\settings\js\vendor.js"

copy settings\settings.html "%BUILD_PATH%\settings\settings.html"