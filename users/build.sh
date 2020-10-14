babel --plugins transform-inline-environment-variables src -d build/src --presets @babel/preset-flow
babel --plugins transform-inline-environment-variables app.js server.js -d build --presets @babel/preset-flow
babel --plugins transform-inline-environment-variables config -d build/config --presets @babel/preset-flow
cp package.json build/package.json
