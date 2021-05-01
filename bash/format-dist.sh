#!/usr/bin/env bash

# Remove lines that start with ';// CONCAT'
sed -i '/^\;\/\/ CONCAT/d' dist/polipop.js

# Remove string '/******/'
sed -i -e 's/\/\*\*\*\*\*\*\///g' dist/polipop.js

# Remove string '// EXPORTS'
sed -i -e 's/\/\/ EXPORTS//g' dist/polipop.js

# Remove lines that start with '/******'
sed -i '/^\/\*\*\*\*\*\*/d' dist/polipop.js

# Remove string '/* harmony default export */'
sed -i -e 's/\/\* harmony default export \*\///g' dist/polipop.js

# Add new line before comment start '/**'
sed -i 's/\/\*\*/\n&/g' dist/polipop.js

# Add new line after comment end ' */'
sed -i 's/ \*\//&\
/g' dist/polipop.js

npx prettier --write dist