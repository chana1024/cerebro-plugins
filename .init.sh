#!/bin/bash
basepath=$(pwd)
for filepath in $basepath/*
do
    filename=$(echo $filepath |python3 -c "import sys; filepath=sys.stdin.read() ;sys.stdout.write(filepath.split('/')[len(filepath.split('/'))-1])")
    echo $filename
    if [ -e "/home/lzn/.config/Cerebro/plugins/node_modules/$file" ]; then
        srm /home/lzn/.config/Cerebro/plugins/node_modules/$filename
    fi
    ln -s $filepath /home/lzn/.config/Cerebro/plugins/node_modules/$filename
    echo 'linking' $filepath
done

