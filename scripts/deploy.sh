echo "Cleanup..."
npm run clean

echo "Building client..."
npm run build
echo

echo "Copying assets..."
cp app/index.html build/index.template.html
mkdir build/resources
cp resources/* build/resources/

echo "Applying conf..."
sed s@/build/bundle.js@/nansi/bundle.js@ build/index.template.html > build/index.html
rm build/index.template.html

echo "Deploying on gh-pages..."
./node_modules/.bin/gh-pages -d build
