#!/bin/sh

DEFAULT='\x1B[0m' # No Color
CYAN='\x1B[1;36m'

clear                                   # Clear the screen.


version=
profilename=
usage="Usage: ./`basename $0` [-p profile] [-v version]"

while getopts p:v: opt
do
   case "$opt" in
      p) profilename=$OPTARG;;
      v) version=$OPTARG;;
      \?) echo $usage >&2
          exit 1
          ;;
   esac
done

#echo "$profilename $version"

if [ "$profilename" = "" ]
then
    echo "${CYAN}List of Profiles: ${DEFAULT}"

    dir="profiles"
    for profile in "$dir"/*; do
        profile=${profile//.build.js/}
        profile=${profile//profiles\//}

        echo "${DEFAULT} - $profile${DEFAULT}"
    done

    echo ;
    echo "${CYAN}Profile Name: ${DEFAULT}"
    read profilename

    if [ "${profilename}" = "" ]
        then
            profilename="master"
        fi
fi

if [ "$version" = "" ]
then
    echo ;
    echo "${CYAN}VERSION: ${DEFAULT}"
    read version

    if [ "${version}" = "" ]
    then
        version="1.0"
    fi
fi

echo ;
echo "${CYAN}Optimizing\033[5;1;36m ...\033[0m"

NAME="_js/config"
OUT="_release/${version}/main.js"

if [ "$profilename" != "master" ]
then
    NAME="${profilename//.//}/$NAME"
    OUT="${profilename//.//}/$OUT"
    echo "Optimize $profilename"
else
    echo "Optimize master"
fi

java -classpath optimizer/js.jar:optimizer/compiler.jar org.mozilla.javascript.tools.shell.Main optimizer/r.js -o ./profiles/$profilename.build.js out=../$OUT name=../../$NAME