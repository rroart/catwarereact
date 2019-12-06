VERSION = 0.1-SNAPSHOT
SUBDIRS = web

all: $(SUBDIRS)

web:
	cd $@ && mkdir -p files && rsync -v -a --exclude node_modules --exclude docroot ../../webr/ files && docker build -t="catwarebank-$@" .

.PHONY: all $(SUBDIRS)
