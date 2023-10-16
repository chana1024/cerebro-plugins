CURRENT_DIR=$( cd $(dirname $0);pwd)
TARGET_DIR=$HOME/.config/Cerebro/plugins/node_modules
# find $CURRENT_DIR -type d -exec ln -s $CURRENT_DIR{} ~/.config/cerebro/node_module/{} \;
find . -maxdepth 1  -type d |awk '/(.git|\.$)/ {next} {print}'|sed 's/\.\///g'|xargs -I{} sh -c "rm -rf $TARGET_DIR/{} ;ln -s $CURRENT_DIR/{} $TARGET_DIR/{}"
