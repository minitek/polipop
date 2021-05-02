#!/usr/bin/env bash

# Remove lines that start with ';// CONCAT'
sed -i '/^\;\/\/ CONCAT/d' dist/polipop.js

# Remove comments '/*(any characters except new line)*/'
sed -i -e 's/\/\*.[^\n]*\*\///g' dist/polipop.js

# Remove string '// EXPORTS'
sed -i -e 's/\/\/ EXPORTS//g' dist/polipop.js

# Add new line before comment start '/**'
sed -i 's/\/\*\*/\n&/g' dist/polipop.js

# Add new line after comment end ' */'
sed -i 's/ \*\//&\
/g' dist/polipop.js

npx prettier --write dist