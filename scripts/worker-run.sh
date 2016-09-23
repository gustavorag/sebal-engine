#!/bin/bash

# Global variables
IMAGES_DIR_NAME=images
RESULTS_DIR_NAME=results
BIN_INIT_SCRIPT="bin/run.sh"

# This function untare image and creates an output dir into mounted dir
function untarImageAndPrepareDirs {
  cd ${SEBAL_MOUNT_POINT}/$IMAGES_DIR_NAME

  echo "Image file name is "${IMAGE_NAME}

  # untar image
  echo "Untaring image ${IMAGE_NAME}"
  cd ${SEBAL_MOUNT_POINT}/$IMAGES_DIR_NAME/${IMAGE_NAME}
  sudo tar -xvzf ${IMAGE_NAME}".tar.gz"

  echo "Creating image output directory"
  sudo mkdir -p ${SEBAL_MOUNT_POINT}/$RESULTS_DIR_NAME/${IMAGE_NAME}
}

function executeRunScript {
  #when https://github.com/xpto/foo-baa.git we have foo-baa which is the root dir of the repo
  repositoryName=`echo ${SEBAL_URL} | rev | cut -d "/" -f1 | cut -d"." -f2 | rev`

  cd ${SANDBOX}

  bash -x $repositoryName/$BIN_RUN_SCRIPT ${IMAGE_NAME} ${SEBAL_MOUNT_POINT}/$IMAGES_DIR_NAME/ ${SEBAL_MOUNT_POINT}/$RESULTS_DIR_NAME/ ${SEBAL_MOUNT_POINT}/$RESULTS_DIR_NAME/${IMAGE_NAME} ${SEBAL_MOUNT_POINT}/$IMAGES_DIR_NAME/${IMAGE_NAME}/${IMAGE_NAME}"_MTL.txt" ${SEBAL_MOUNT_POINT}/$IMAGES_DIR_NAME/${IMAGE_NAME}/${IMAGE_NAME}"_MTLFmask" ${SEBAL_MOUNT_POINT}/$RESULTS_DIR_NAME/${IMAGE_NAME}/${IMAGE_NAME}"_station.csv"
}

# This function do a checksum of all output files in image dir
function checkSum {
  sudo find ${SEBAL_MOUNT_POINT}/$RESULTS_DIR_NAME/${IMAGE_NAME} -type f -iname "*.nc" | while read f
  do
    CHECK_SUM=$(echo | md5sum $f | cut -c1-32)
    sudo touch $f.$CHECK_SUM.md5
  done
}

# This function ends the script
function finally {
  # see if this rm will be necessary
  #rm -r /tmp/Rtmp*
  PROCESS_OUTPUT=$?

  echo $PROCESS_OUTPUT > ${REMOTE_COMMAND_EXIT_PATH}
}

untarImageAndPrepareDirs
executeRunScript
checkSum
finally