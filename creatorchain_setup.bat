@echo off
:: Navigate to the root folder (make sure you're in creatorchain)
echo Setting up extended CreatorChain folder structure...

:: Create folders
mkdir components\common
mkdir context
mkdir hooks
mkdir lib
mkdir types
mkdir public\images
mkdir styles

:: Create boilerplate component files
echo // Reusable Button component > components\common\Button.js
echo // Reusable Card component > components\common\Card.js
echo // Reusable Modal component > components\common\Modal.js
echo // Main Layout component > components\Layout.js
echo // Navigation bar component > components\Navbar.js

:: Create context
echo // Auth context setup > context\AuthContext.js

:: Create hooks
echo // useAuth custom hook > hooks\useAuth.js

:: Create lib (logic layer)
echo // API interaction functions > lib\api.js
echo // Referral tracking logic > lib\referrals.js

:: Create types
echo // Content data model > types\content.js

:: Create global styles
echo @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"); > styles\globals.css
echo html, body { font-family: 'Poppins', sans-serif; margin: 0; padding: 0; background-color: #1e293b; } >> styles\globals.css

:: Final message
echo Folder structure and boilerplate files created successfully!
pause
